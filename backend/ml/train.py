import os
import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

from url_detector import extract_url_features

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
MODELS_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODELS_DIR, exist_ok=True)

# ─── URL DATASET ─────────────────────────────────────────────────────────────

LEGITIMATE_URLS = [
    "https://www.google.com",
    "https://github.com/nyzxis/personal-portfolio",
    "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    "https://stackoverflow.com/questions/tagged/python",
    "https://en.wikipedia.org/wiki/Machine_learning",
    "https://react.dev/reference/react",
    "https://www.amazon.com/dp/B08N5WRWNW",
    "https://news.ycombinator.com",
    "https://tailwindcss.com/docs/installation",
    "https://www.microsoft.com/en-us/windows",
    "https://apple.com/macbook-pro",
    "https://netflix.com/browse",
    "https://linkedin.com/in/arfadanial",
    "https://hub.docker.com/_/postgres",
    "https://flask.palletsprojects.com/en/3.0.x/",
    "https://scikit-learn.org/stable/modules/ensemble.html",
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://nytimes.com/section/technology",
    "https://www.cloudflare.com/learning/security/what-is-phishing/",
    "https://medium.com/@dev/full-stack-guide",
    "https://gitlab.com/projects",
    "https://bitbucket.org/product",
    "https://vercel.com/dashboard",
    "https://supabase.com/docs",
    "https://stripe.com/docs/api"
]

PHISHING_URLS = [
    "http://192.168.1.105/paypal-login/verify.html",
    "http://secure-appleid-verification-update.xyz/login.php",
    "http://chase-online-banking-security-alert.top/signin",
    "http://wells-fargo-account-suspended-verify.tk/auth",
    "http://netflix-billing-update-required.ml/payment",
    "http://accounts.google.com.security-checkup.gq/login",
    "http://203.0.113.45/bankofamerica/secure_login",
    "http://crypto-wallet-connect-airdrop.buzz/claim",
    "http://microsoft-365-office-password-reset.click/auth.asp",
    "http://instagram-copyright-infringement-appeal.rest/form",
    "http://amazon-prime-order-confirmation-unusual.xyz/confirm",
    "http://facebook-security-team-account-disabled.monster/review",
    "http://binance-kyc-verification-required.work/login",
    "http://irs-tax-refund-direct-deposit.country/claim.php",
    "http://steam-community-free-skins-trade.xyz/login",
    "http://198.51.100.22/dhl-express-package-delivery-fee.php",
    "http://coinbase-two-factor-auth-bypass.kim/verify",
    "http://metamask-seed-phrase-restore-sync.xyz/wallet",
    "http://bank-of-america-urgent-action-required.top/login",
    "http://adobe-document-cloud-shared-file.click/signin.php",
    "http://104.28.19.45/webmail/login_verify.php",
    "http://dropbox-file-transfer-download-secure.xyz/get",
    "http://citibank-customer-service-reactivate.buzz/portal",
    "http://discord-nitro-free-gift-claim.monster/accept",
    "http://fedex-tracking-parcel-exception-reschedule.work/track"
]

# ─── EMAIL DATASET ───────────────────────────────────────────────────────────

LEGITIMATE_EMAILS = [
    "Hi Arfa, thanks for submitting your pull request. The team will review your code shortly.",
    "Your weekly GitHub digest is ready. Here are the top repositories you starred this week.",
    "Meeting reminder: Project sprint planning tomorrow at 10:00 AM in Conference Room B.",
    "Your order #98214 has shipped via FedEx. Track your shipment with tracking number 7892341.",
    "Thank you for attending the Python developer conference. Slides and recordings are now available.",
    "Receipt for your Spotify Premium subscription. Amount charged: $9.99 on your Visa card ending in 4102.",
    "New comment on issue #45: 'I was able to reproduce the bug on Node 22. Here is the stack trace.'",
    "Your flight confirmation to Singapore. Departure: Sunday 08:30 AM Terminal 1 Gate 14.",
    "Hi team, please find attached the monthly analytics report for August 2026. All KPIs met.",
    "University notice: Campus library hours extended during finals week. Good luck with exams!",
    "Welcome to the Docker newsletter. Check out new container security best practices in this issue.",
    "Your password was recently changed from a known device in Selangor, Malaysia. If this was you, no action needed.",
    "Here is the invoice for last month's freelance web development services as discussed. Thank you!",
    "Invitation to collaborate on repository nyzxis/portfolio. Accept invitation to join the team.",
    "Google Calendar: Team lunch scheduled for Friday at 1:00 PM."
]

PHISHING_EMAILS = [
    "URGENT: Your PayPal account has been suspended due to suspicious activity. Verify your identity within 24 hours at http://192.168.1.105/paypal/login or account will be permanently terminated.",
    "Security Alert: Unauthorized login attempt detected on your bank account from Russia. Click here to verify your password immediately and freeze unauthorized wire transfers.",
    "FINAL NOTICE: Your Microsoft 365 cloud subscription has expired. Update your billing credentials now to avoid immediate file deletion: http://microsoft-365-verify.xyz",
    "Apple Support: Your iCloud has been locked for security reasons. Confirm your Apple ID credentials here immediately: http://appleid-confirm.top",
    "IRS Notification: You are eligible for a tax refund of $1,420.50. Submit your banking details and social security number to receive direct deposit within 24 hours.",
    "Netflix: We were unable to process your latest payment. Update your credit card details immediately to avoid account cancellation.",
    "Amazon Security: We detected an unusual order of $899 placed on your account. If you did not make this purchase, click here to cancel and verify your account.",
    "CEO Request: I am currently in a conference and need you to urgently process an emergency wire transfer of $15,000 for a client. Reply with confirmation.",
    "MetaMask Alert: Your crypto wallet requires mandatory sync verification. Enter your 12-word seed phrase here to protect your funds from being frozen.",
    "Internal IT Helpdesk: Mandatory security certificate update. All employees must click the link below and enter their corporate credentials immediately.",
    "DHL Express: We attempted to deliver your package today but address was incomplete. Pay $2.99 re-delivery fee at http://dhl-parcel-fee.xyz within 12 hours.",
    "Bank of America Alert: Suspicious transaction of $2,450 detected. Click here immediately to decline this transaction and reset your security passcode.",
    "Instagram Security: Your account has been reported for copyright infringement. Submit an appeal within 24 hours or your profile will be deleted forever.",
    "Dropbox Transfer: You received an urgent confidential document from Human Resources. Sign in with your email and password to view the PDF file.",
    "Action Required: Your email mailbox is almost full (98%). Click here to validate your account and upgrade quota to prevent bounce-backs."
]

def train_url_model():
    print("[1/2] Training URL Phishing Detector (Random Forest)...")
    X = []
    y = []

    for u in LEGITIMATE_URLS:
        features = extract_url_features(u)["vector"]
        X.append(features)
        y.append(0)  # Safe

    for u in PHISHING_URLS:
        features = extract_url_features(u)["vector"]
        X.append(features)
        y.append(1)  # Phishing

    X = np.array(X)
    y = np.array(y)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    clf = RandomForestClassifier(
        n_estimators=100,
        max_depth=6,
        random_state=42,
        class_weight="balanced"
    )
    clf.fit(X_train, y_train)

    preds = clf.predict(X_test)
    acc = accuracy_score(y_test, preds)
    print(f"  -> URL Model Test Accuracy: {acc * 100:.1f}%")

    model_path = os.path.join(MODELS_DIR, "url_model.joblib")
    joblib.dump(clf, model_path)
    print(f"  -> Saved URL model to: {model_path}")

def train_email_model():
    print("\n[2/2] Training Email Phishing Detector (TF-IDF + Naive Bayes)...")
    texts = LEGITIMATE_EMAILS + PHISHING_EMAILS
    labels = [0] * len(LEGITIMATE_EMAILS) + [1] * len(PHISHING_EMAILS)

    X_train, X_test, y_train, y_test = train_test_split(
        texts, labels, test_size=0.2, random_state=42, stratify=labels
    )

    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        max_features=1000,
        stop_words="english"
    )
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    nb = MultinomialNB(alpha=0.5)
    nb.fit(X_train_vec, y_train)

    preds = nb.predict(X_test_vec)
    acc = accuracy_score(y_test, preds)
    print(f"  -> Email Model Test Accuracy: {acc * 100:.1f}%")

    vec_path = os.path.join(MODELS_DIR, "email_vectorizer.joblib")
    model_path = os.path.join(MODELS_DIR, "email_model.joblib")

    joblib.dump(vectorizer, vec_path)
    joblib.dump(nb, model_path)
    print(f"  -> Saved Email Vectorizer to: {vec_path}")
    print(f"  -> Saved Email Model to: {model_path}")

if __name__ == "__main__":
    print("=== Training AI-Powered Phishing Detection Models ===")
    train_url_model()
    train_email_model()
    print("\n[OK] All models trained and saved successfully!")
