"""
Aegis AI — Flask ML Service
Loads both trained models at startup and serves predictions.

Run:
  cd ml-service
  source venv/bin/activate
  python serve.py

Endpoints:
  POST /predict/url
  POST /predict/email
  GET  /health
"""

import os
import sys
import logging
from flask import Flask, request, jsonify
import joblib
import numpy as np
from transformers import pipeline

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from utils.url_features import features_to_vector, get_feature_names

# ─── SETUP ───────────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)

MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')
URL_MODEL_DIR = os.path.join(MODEL_DIR, 'url_classifier')
EMAIL_MODEL_DIR = os.path.join(MODEL_DIR, 'email_classifier')

# ─── LOAD MODELS AT STARTUP ──────────────────────────────────────────────────
url_model = None
url_scaler = None
email_classifier = None

def load_models():
    global url_model, url_scaler, email_classifier

    # Load URL model
    url_model_path = os.path.join(URL_MODEL_DIR, 'url_model.pkl')
    url_scaler_path = os.path.join(URL_MODEL_DIR, 'scaler.pkl')

    if os.path.exists(url_model_path) and os.path.exists(url_scaler_path):
        logger.info("Loading URL classifier...")
        url_model = joblib.load(url_model_path)
        url_scaler = joblib.load(url_scaler_path)
        logger.info("✅ URL classifier loaded")
    else:
        logger.warning("⚠️  URL model not found — /predict/url will return fallback")

    # Load Email model (Tanaya's DistilBERT)
    if os.path.exists(EMAIL_MODEL_DIR) and os.listdir(EMAIL_MODEL_DIR):
        logger.info("Loading email classifier (DistilBERT)...")
        try:
            email_classifier = pipeline(
                'text-classification',
                model=EMAIL_MODEL_DIR,
                tokenizer=EMAIL_MODEL_DIR,
                device=-1  # CPU — use 0 for GPU if available
            )
            logger.info("✅ Email classifier loaded")
        except Exception as e:
            logger.warning(f"⚠️  Email model load failed: {e}")
    else:
        logger.warning("⚠️  Email model not found — /predict/email will return fallback")

# ─── ROUTES ──────────────────────────────────────────────────────────────────

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'url_model_loaded': url_model is not None,
        'email_model_loaded': email_classifier is not None
    })

@app.route('/predict/url', methods=['POST'])
def predict_url():
    data = request.get_json()
    url = data.get('url', '').strip()

    if not url:
        return jsonify({'error': 'url is required'}), 400

    if url_model is None or url_scaler is None:
        # Model not loaded — return a safe default so backend can use rule engine
        return jsonify({
            'verdict': 'UNKNOWN',
            'confidence': 0.5,
            'reasons': ['ML model not available — rule engine result used'],
            'model_available': False
        }), 503

    try:
        features = features_to_vector(url)
        features_scaled = url_scaler.transform([features])
        probabilities = url_model.predict_proba(features_scaled)[0]

        phishing_prob = float(probabilities[1])
        safe_prob = float(probabilities[0])

        verdict = 'UNSAFE' if phishing_prob >= 0.5 else 'SAFE'
        confidence = round(max(phishing_prob, safe_prob), 4)

        # Build human-readable reasons from top features
        reasons = build_url_reasons(url, features, phishing_prob)

        return jsonify({
            'verdict': verdict,
            'confidence': confidence,
            'reasons': reasons,
            'model_available': True
        })

    except Exception as e:
        logger.error(f"URL prediction error: {e}")
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

@app.route('/predict/email', methods=['POST'])
def predict_email():
    data = request.get_json()
    sender = data.get('sender', '').strip()
    content = data.get('content', '').strip()

    if not content:
        return jsonify({'error': 'content is required'}), 400

    if email_classifier is None:
        return jsonify({
            'verdict': 'UNKNOWN',
            'confidence': 0.5,
            'reasons': ['Email ML model not available — rule engine result used'],
            'model_available': False
        }), 503

    try:
        # DistilBERT has a 512 token limit — truncate long emails
        combined_input = f"From: {sender}\n\n{content}"[:2000]

        result = email_classifier(combined_input, truncation=True, max_length=512)[0]

        # Tanaya's model labels: LABEL_1 = phishing, LABEL_0 = safe
        # (confirm label convention with Tanaya when she shares her model)
        is_phishing = result['label'] in ('LABEL_1', 'PHISHING', 'FAKE')
        confidence = round(float(result['score']), 4)

        verdict = 'FAKE' if is_phishing else 'SAFE'

        reasons = []
        if is_phishing:
            reasons.append(f'Email content classified as phishing by ML model (confidence: {confidence:.0%})')
        else:
            reasons.append(f'Email content appears legitimate (confidence: {confidence:.0%})')

        return jsonify({
            'verdict': verdict,
            'confidence': confidence,
            'reasons': reasons,
            'model_available': True
        })

    except Exception as e:
        logger.error(f"Email prediction error: {e}")
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

def build_url_reasons(url: str, features: list, phishing_prob: float) -> list:
    """Build human-readable explanation from feature values."""
    reasons = []
    feat_names = get_feature_names()
    feat_dict = dict(zip(feat_names, features))

    if feat_dict.get('has_https') == 0:
        reasons.append('No SSL certificate (HTTP connection)')
    if feat_dict.get('has_ip') == 1:
        reasons.append('IP address used instead of domain name')
    if feat_dict.get('has_at_symbol') == 1:
        reasons.append('URL contains @ symbol — destination is being disguised')
    if feat_dict.get('num_subdomains', 0) > 2:
        reasons.append(f"Excessive subdomains ({int(feat_dict['num_subdomains'])})")
    if feat_dict.get('suspicious_keyword_count', 0) > 0:
        reasons.append(f"Contains {int(feat_dict['suspicious_keyword_count'])} suspicious keyword(s)")
    if feat_dict.get('url_entropy', 0) > 4.5:
        reasons.append('High URL entropy — unusual character patterns detected')
    if feat_dict.get('digits_in_hostname', 0) > 2:
        reasons.append('Hostname contains digits — common in domain spoofing')

    if not reasons:
        if phishing_prob >= 0.5:
            reasons.append('URL pattern matches known phishing characteristics')
        else:
            reasons.append('No significant phishing indicators detected')

    return reasons

# ─── START ───────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    load_models()
    port = int(os.environ.get('PORT', 5000))
    logger.info(f"🚀 Aegis AI ML service running on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)