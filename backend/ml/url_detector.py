import os
import re
import math
from urllib.parse import urlparse
import joblib
import numpy as np

SUSPICIOUS_TLDS = {
    ".xyz", ".top", ".tk", ".ml", ".ga", ".cf", ".gq", ".work",
    ".click", ".buzz", ".fit", ".rest", ".monster", ".country", ".kim"
}

SECURITY_KEYWORDS = [
    "login", "signin", "verify", "verification", "secure", "security",
    "account", "update", "banking", "bank", "paypal", "appleid",
    "wallet", "password", "recover", "authenticate", "confirm", "billing",
    "suspended", "unusual", "auth", "credential", "crypto"
]

def calculate_entropy(text: str) -> float:
    """Calculates Shannon entropy of string (high entropy indicates random/DGA domains)."""
    if not text:
        return 0.0
    prob = [float(text.count(c)) / len(text) for c in dict.fromkeys(list(text))]
    return -sum([p * math.log(p) / math.log(2.0) for p in prob])

def extract_url_features(url: str) -> dict:
    """Extracts 14 numerical and categorical features from URL."""
    url = url.strip()
    if not url.startswith(("http://", "https://")):
        url_with_scheme = "http://" + url
    else:
        url_with_scheme = url

    parsed = urlparse(url_with_scheme)
    hostname = parsed.hostname or ""
    path = parsed.path or ""
    query = parsed.query or ""

    # Feature 1: IP address in URL
    ip_pattern = r"^(\d{1,3}\.){3}\d{1,3}$"
    has_ip = 1 if re.match(ip_pattern, hostname) else 0

    # Feature 2: Length of URL
    url_len = len(url)

    # Feature 3: Domain length
    domain_len = len(hostname)

    # Feature 4: '@' symbol in URL
    has_at = 1 if "@" in url else 0

    # Feature 5: Double slash redirect in path
    has_double_slash = 1 if "//" in path else 0

    # Feature 6: Prefix/Suffix hyphens in domain
    hyphen_count = hostname.count("-")

    # Feature 7: Subdomain count
    subdomains = hostname.split(".")
    subdomain_count = max(0, len(subdomains) - 2)

    # Feature 8: HTTPS protocol
    is_https = 1 if parsed.scheme == "https" else 0

    # Feature 9: Suspicious TLD
    tld = "." + hostname.split(".")[-1] if "." in hostname else ""
    is_suspicious_tld = 1 if tld.lower() in SUSPICIOUS_TLDS else 0

    # Feature 10: Count of security keywords
    lower_url = url.lower()
    keywords_matched = [kw for kw in SECURITY_KEYWORDS if kw in lower_url]
    keyword_count = len(keywords_matched)

    # Feature 11: Digit count in hostname
    digit_count = sum(c.isdigit() for c in hostname)

    # Feature 12: Non-standard port
    has_non_standard_port = 1 if parsed.port and parsed.port not in [80, 443] else 0

    # Feature 13: Shannon entropy of hostname
    entropy = calculate_entropy(hostname)

    # Feature 14: Special characters count in URL (?, =, &, %, _)
    special_chars = sum(url.count(c) for c in ["?", "=", "&", "%", "_"])

    feature_vector = [
        has_ip,
        url_len,
        domain_len,
        has_at,
        has_double_slash,
        hyphen_count,
        subdomain_count,
        is_https,
        is_suspicious_tld,
        keyword_count,
        digit_count,
        has_non_standard_port,
        entropy,
        special_chars
    ]

    details = {
        "hostname": hostname,
        "is_https": bool(is_https),
        "has_ip_address": bool(has_ip),
        "url_length": url_len,
        "domain_length": domain_len,
        "hyphen_count": hyphen_count,
        "subdomain_depth": subdomain_count,
        "suspicious_tld": tld if is_suspicious_tld else None,
        "keywords_found": keywords_matched,
        "domain_entropy": round(entropy, 2),
        "special_chars_count": special_chars
    }

    return {
        "vector": feature_vector,
        "details": details
    }

class UrlDetector:
    def __init__(self, models_dir: str):
        self.model_path = os.path.join(models_dir, "url_model.joblib")
        self.model = None
        self.load_model()

    def load_model(self):
        if os.path.exists(self.model_path):
            try:
                self.model = joblib.load(self.model_path)
            except Exception as e:
                print(f"[UrlDetector] Error loading model: {e}")
                self.model = None

    def predict(self, url: str) -> dict:
        extracted = extract_url_features(url)
        vector = extracted["vector"]
        details = extracted["details"]

        # Rule-based heuristics calculation for explainability
        heuristic_score = 0.0
        threat_flags = []

        if details["has_ip_address"]:
            heuristic_score += 35
            threat_flags.append("Direct IP address used instead of domain name")
        if not details["is_https"]:
            heuristic_score += 15
            threat_flags.append("Insecure HTTP protocol (no SSL/TLS)")
        if details["url_length"] > 75:
            heuristic_score += 15
            threat_flags.append("Excessively long URL often used for link obfuscation")
        if details["hyphen_count"] >= 2:
            heuristic_score += 20
            threat_flags.append("Multiple hyphens in domain, common in spoofed brand URLs")
        if details["subdomain_depth"] >= 2:
            heuristic_score += 15
            threat_flags.append("Deep subdomain structure hiding primary host")
        if details["suspicious_tld"]:
            heuristic_score += 25
            threat_flags.append(f"High-risk Top-Level Domain detected ({details['suspicious_tld']})")
        if details["keywords_found"]:
            keyword_weight = min(40, len(details["keywords_found"]) * 15)
            heuristic_score += keyword_weight
            threat_flags.append(f"Phishing lure keywords present: {', '.join(details['keywords_found'])}")
        if details["domain_entropy"] > 3.8:
            heuristic_score += 20
            threat_flags.append("High domain randomness/entropy indicating algorithmic generation")

        # ML Model prediction
        ml_score = None
        ml_confidence = 0.85

        if self.model is not None:
            try:
                X = np.array([vector])
                probs = self.model.predict_proba(X)[0]
                # Index 1 is Phishing probability
                ml_score = probs[1] * 100.0
                ml_confidence = float(np.max(probs))
            except Exception as e:
                print(f"[UrlDetector] Prediction error: {e}")

        # Combine ML and heuristics
        if ml_score is not None:
            combined_score = (ml_score * 0.7) + (min(100.0, heuristic_score) * 0.3)
        else:
            combined_score = min(100.0, heuristic_score)

        combined_score = max(0.0, min(100.0, combined_score))

        # Verdict assignment
        if combined_score >= 65.0:
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
            "details": details,
            "model_active": self.model is not None
        }
