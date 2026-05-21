"""
Aegis AI — Flask ML Service
Loads both trained models at startup and serves predictions.

Run:
  cd ml-service
  venv\Scripts\activate
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
                device=-1  # CPU
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
        # Combine sender + content for context
        combined_input = f"From: {sender}\n\n{content}"[:2000]

        result = email_classifier(
            combined_input,
            truncation=True,
            max_length=512
        )[0]

        is_phishing_label = result['label'] in ('LABEL_1', 'PHISHING', 'FAKE')
        raw_confidence = float(result['score'])

        # ── Confidence threshold logic ────────────────────────────────
        # Only trust model when it's highly confident (>= 0.85)
        # Below threshold → fall back to keyword rules
        if is_phishing_label and raw_confidence >= 0.85:
            verdict = 'FAKE'
            confidence = round(raw_confidence, 4)
        elif not is_phishing_label and raw_confidence >= 0.85:
            verdict = 'SAFE'
            confidence = round(raw_confidence, 4)
        else:
            # Low confidence — use keyword fallback
            suspicious_words = [
                "verify", "suspended", "click here", "confirm your",
                "limited time", "act now", "login immediately",
                "unusual activity", "security alert", "account locked",
                "urgent", "winner", "prize", "free money"
            ]
            triggered = [w for w in suspicious_words if w in content.lower()]
            verdict = 'FAKE' if len(triggered) >= 2 else 'SAFE'
            confidence = round(raw_confidence, 4)

        # ── Build reasons ─────────────────────────────────────────────
        reasons = []
        if verdict == 'FAKE':
            reasons.append(
                f'Email content classified as phishing by ML model '
                f'(confidence: {confidence:.0%})'
            )
            # Add specific signals
            sender_domain = sender.split("@")[-1].lower() if "@" in sender else ""
            if any(c.isdigit() for c in sender_domain.split(".")[0]):
                reasons.append(f'Sender domain contains suspicious numbers: {sender_domain}')

            urgent_words = ["urgent", "verify", "suspended", "act now", "click here",
                           "confirm", "limited time", "unusual activity"]
            found = [w for w in urgent_words if w in content.lower()]
            if found:
                reasons.append(f'Urgency language detected: {", ".join(found[:3])}')
        else:
            reasons.append(
                f'Email content appears legitimate '
                f'(confidence: {confidence:.0%})'
            )

        # ── Precautions ───────────────────────────────────────────────
        precautions = []
        if verdict == 'FAKE':
            precautions = [
                "Do not click any links in this email",
                "Do not download any attachments",
                "Report as phishing to your email provider",
                "Verify the sender through official channels"
            ]

        return jsonify({
            'verdict': verdict,
            'confidence': confidence,
            'reasons': reasons,
            'precautions': precautions,
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