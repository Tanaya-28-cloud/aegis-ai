"""
URL Classifier Training Script
Uses URLNet-inspired CNN approach with handcrafted features.

Before running:
1. Download PhishTank dataset: https://phishtank.org/developer_info.php
   Save as: ml-service/data/phishtank.csv
2. Download Tranco list: https://tranco-list.eu/
   Save as: ml-service/data/tranco.csv

Run:
  cd ml-service
  source venv/bin/activate
  python train/train_url.py
"""

import os
import sys
import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, precision_score, recall_score, f1_score
from sklearn.preprocessing import StandardScaler
import joblib

# Add parent directory to path so we can import utils
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.url_features import features_to_vector, get_feature_names

# ─── CONFIG ──────────────────────────────────────────────────────────────────
DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'models', 'url_classifier')
PHISHTANK_PATH = os.path.join(DATA_DIR, 'phishtank.csv')
TRANCO_PATH = os.path.join(DATA_DIR, 'tranco.csv')
TARGET_PRECISION = 0.93

os.makedirs(MODEL_DIR, exist_ok=True)

# ─── LOAD DATA ───────────────────────────────────────────────────────────────
print("📂 Loading datasets...")

# Load phishing URLs (label = 1)
phish_df = pd.read_csv(PHISHTANK_PATH, usecols=['url'])
phish_df.columns = ['url']
phish_df['label'] = 1  # 1 = phishing
print(f"   Phishing URLs loaded: {len(phish_df)}")

# Load legitimate URLs from Tranco (label = 0)
tranco_df = pd.read_csv(TRANCO_PATH, header=None, names=['rank', 'domain'])
tranco_df['url'] = 'https://' + tranco_df['domain']
tranco_df = tranco_df[['url']].head(len(phish_df))  # balance dataset
tranco_df['label'] = 0  # 0 = legitimate
print(f"   Legitimate URLs loaded: {len(tranco_df)}")

# Combine and shuffle
df = pd.concat([phish_df, tranco_df], ignore_index=True)
df = df.sample(frac=1, random_state=42).reset_index(drop=True)
print(f"   Total samples: {len(df)} (balanced: {df['label'].value_counts().to_dict()})")

# ─── FEATURE EXTRACTION ───────────────────────────────────────────────────────
print("\n⚙️  Extracting features...")

features = []
labels = []
failed = 0

for i, row in df.iterrows():
    if i % 5000 == 0:
        print(f"   Processing {i}/{len(df)}...")
    try:
        feat = features_to_vector(row['url'])
        features.append(feat)
        labels.append(row['label'])
    except Exception:
        failed += 1

print(f"   ✅ Features extracted. Failed: {failed}")

X = np.array(features)
y = np.array(labels)

# ─── TRAIN/TEST SPLIT ────────────────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
print(f"\n📊 Train: {len(X_train)} | Test: {len(X_test)}")

# ─── SCALE FEATURES ──────────────────────────────────────────────────────────
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# ─── TRAIN MODEL ─────────────────────────────────────────────────────────────
print("\n🧠 Training Gradient Boosting Classifier...")

model = GradientBoostingClassifier(
    n_estimators=200,
    max_depth=5,
    learning_rate=0.1,
    subsample=0.8,
    random_state=42,
    verbose=1
)
model.fit(X_train_scaled, y_train)

# ─── EVALUATE ────────────────────────────────────────────────────────────────
print("\n📈 Evaluating...")
y_pred = model.predict(X_test_scaled)
y_prob = model.predict_proba(X_test_scaled)[:, 1]

precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)

print(f"\n   Precision: {precision:.4f}  {'✅' if precision >= TARGET_PRECISION else '❌ Below target'}")
print(f"   Recall:    {recall:.4f}")
print(f"   F1 Score:  {f1:.4f}")
print("\nFull report:")
print(classification_report(y_test, y_pred, target_names=['SAFE', 'PHISHING']))

if precision < TARGET_PRECISION:
    print(f"\n⚠️  WARNING: Precision {precision:.4f} is below target {TARGET_PRECISION}")
    print("   Consider tuning n_estimators or max_depth before deploying")

# ─── FEATURE IMPORTANCE ──────────────────────────────────────────────────────
print("\n🔍 Top 10 most important features:")
feature_names = get_feature_names()
importances = sorted(
    zip(feature_names, model.feature_importances_),
    key=lambda x: x[1], reverse=True
)
for name, importance in importances[:10]:
    bar = '█' * int(importance * 100)
    print(f"   {name:<30} {importance:.4f} {bar}")

# ─── SAVE MODEL ──────────────────────────────────────────────────────────────
print(f"\n💾 Saving model to {MODEL_DIR}/")
joblib.dump(model, os.path.join(MODEL_DIR, 'url_model.pkl'))
joblib.dump(scaler, os.path.join(MODEL_DIR, 'scaler.pkl'))

# Save feature names for serve.py to verify order
with open(os.path.join(MODEL_DIR, 'feature_names.txt'), 'w') as f:
    f.write('\n'.join(feature_names))

print("✅ Model saved successfully!")
print(f"   url_model.pkl  — the trained classifier")
print(f"   scaler.pkl     — the feature scaler")
print(f"   feature_names.txt — feature order reference")