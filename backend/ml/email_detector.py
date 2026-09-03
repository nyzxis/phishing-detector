import os
import re
import joblib
import numpy as np

URGENCY_PATTERNS = [
    r"\bimmediate(ly)?\b",
    r"\burgent\b",
    r"\bwithin 24 hours\b",
    r"\baccount suspended\b",
    r"\baction required\b",
    r"\bunauthorized login\b",
    r"\bfinal notice\b",
    r"\bsecurity alert\b",
    r"\bde-activated\b",
    r"\bdeactivated\b",
    r"\bfreeze your account\b"
]

FINANCIAL_PATTERNS = [
    r"\bbank\b",
    r"\bwire transfer\b",
    r"\bpayment declined\b",
    r"\binvoice attached\b",
    r"\brefund of\b",
    r"\bbitcoin\b",
    r"\bcrypto\b",
    r"\bwallet address\b",
    r"\bpayroll\b",
    r"\btax refund\b"
]

CREDENTIAL_PATTERNS = [
    r"\bverify your password\b",
    r"\breset your password\b",
    r"\bclick here to login\b",
    r"\bupdate your credentials\b",
    r"\bconfirm your identity\b",
    r"\bsign in below\b",
    r"\bvalidate your account\b"
]

def extract_email_heuristics(text: str) -> dict:
    lower_text = text.lower()

    # Match urgency triggers
    urgency_matches = []
    for pattern in URGENCY_PATTERNS:
        matches = re.findall(pattern, lower_text)
        if matches:
            urgency_matches.append(pattern.replace(r"\b", "").replace("?", ""))

    # Match financial triggers
    financial_matches = []
    for pattern in FINANCIAL_PATTERNS:
        matches = re.findall(pattern, lower_text)
        if matches:
            financial_matches.append(pattern.replace(r"\b", ""))

    # Match credential harvest triggers
    credential_matches = []
    for pattern in CREDENTIAL_PATTERNS:
        matches = re.findall(pattern, lower_text)
        if matches:
            credential_matches.append(pattern.replace(r"\b", ""))

    # Find embedded links in email body
    url_pattern = r"https?://[^\s<>\"']+|www\.[^\s<>\"']+"
    embedded_urls = re.findall(url_pattern, text)

    # Check for IP-based or suspicious URLs in email
    suspicious_urls_in_email = [
        u for u in embedded_urls
        if re.search(r"(\d{1,3}\.){3}\d{1,3}", u) or any(tld in u for tld in [".xyz", ".top", ".tk", ".ru"])
    ]

    return {
        "urgency_triggers": urgency_matches,
        "financial_triggers": financial_matches,
        "credential_triggers": credential_matches,
        "embedded_urls_count": len(embedded_urls),
        "suspicious_urls": suspicious_urls_in_email,
        "word_count": len(text.split()),
        "character_count": len(text)
    }

class EmailDetector:
    def __init__(self, models_dir: str):
        self.vectorizer_path = os.path.join(models_dir, "email_vectorizer.joblib")
        self.model_path = os.path.join(models_dir, "email_model.joblib")
        self.vectorizer = None
        self.model = None
        self.load_model()

    def load_model(self):
        if os.path.exists(self.model_path) and os.path.exists(self.vectorizer_path):
            try:
                self.vectorizer = joblib.load(self.vectorizer_path)
                self.model = joblib.load(self.model_path)
            except Exception as e:
                print(f"[EmailDetector] Error loading model: {e}")
                self.vectorizer = None
                self.model = None

    def predict(self, email_text: str) -> dict:
        heuristics = extract_email_heuristics(email_text)

        # Rule-based heuristics score
        heuristic_score = 0.0
        threat_flags = []

        if heuristics["credential_triggers"]:
            heuristic_score += 40
            threat_flags.append(f"Credential harvesting language: {', '.join(heuristics['credential_triggers'])}")

        if heuristics["urgency_triggers"]:
            heuristic_score += 25
            threat_flags.append(f"Artificial urgency and pressure tactics: {', '.join(heuristics['urgency_triggers'])}")

        if heuristics["financial_triggers"]:
            heuristic_score += 20
            threat_flags.append(f"Financial transaction hooks: {', '.join(heuristics['financial_triggers'])}")

        if heuristics["suspicious_urls"]:
            heuristic_score += 30
            threat_flags.append(f"Suspicious unverified URLs detected in message body ({len(heuristics['suspicious_urls'])} found)")
        elif heuristics["embedded_urls_count"] > 3:
            heuristic_score += 15
            threat_flags.append(f"Multiple external hyperlinks ({heuristics['embedded_urls_count']}) embedded")

        # NLP Model Prediction
        ml_score = None
        ml_confidence = 0.85

        if self.model is not None and self.vectorizer is not None:
            try:
                X = self.vectorizer.transform([email_text])
                probs = self.model.predict_proba(X)[0]
                # Index 1 is Phishing
                ml_score = probs[1] * 100.0
                ml_confidence = float(np.max(probs))
            except Exception as e:
                print(f"[EmailDetector] Prediction error: {e}")

        # Combine ML and heuristics
        if ml_score is not None:
            combined_score = (ml_score * 0.65) + (min(100.0, heuristic_score) * 0.35)
        else:
            combined_score = min(100.0, heuristic_score)

        combined_score = max(0.0, min(100.0, combined_score))

        # Verdict assignment
        if combined_score >= 60.0:
            verdict = "Phishing"
        elif combined_score >= 35.0:
            verdict = "Suspicious"
        else:
            verdict = "Safe"

        return {
            "risk_score": round(combined_score, 1),
            "verdict": verdict,
            "confidence": round(ml_confidence, 2),
            "threat_flags": threat_flags,
            "details": heuristics,
            "model_active": self.model is not None
        }
