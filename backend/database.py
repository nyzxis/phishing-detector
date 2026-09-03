from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class ScanRecord(db.Model):
    __tablename__ = "scan_records"

    id = db.Column(db.Integer, primary_key=True)
    scan_type = db.Column(db.String(20), nullable=False)  # 'url' or 'email'
    target_input = db.Column(db.Text, nullable=False)
    risk_score = db.Column(db.Float, nullable=False)  # 0.0 to 100.0
    verdict = db.Column(db.String(30), nullable=False)  # 'Safe', 'Suspicious', 'Phishing'
    confidence = db.Column(db.Float, nullable=False, default=0.0)  # 0.0 to 1.0
    features = db.Column(db.JSON, nullable=True)  # Detailed feature map and flags
    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )

    def to_dict(self):
        return {
            "id": self.id,
            "scan_type": self.scan_type,
            "target_input": self.target_input[:120] + "..." if len(self.target_input) > 120 else self.target_input,
            "full_input": self.target_input,
            "risk_score": round(self.risk_score, 1),
            "verdict": self.verdict,
            "confidence": round(self.confidence * 100, 1),
            "features": self.features or {},
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }
