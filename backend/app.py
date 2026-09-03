import os
import sys

# Ensure backend root is on sys.path
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
sys.path.insert(0, BASE_DIR)

from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from database import db, ScanRecord
from ml.url_detector import UrlDetector
from ml.email_detector import EmailDetector

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

# Initialize database
db.init_app(app)

# Initialize ML Detectors
url_detector = UrlDetector(app.config["MODELS_DIR"])
email_detector = EmailDetector(app.config["MODELS_DIR"])

with app.app_context():
    db.create_all()

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "online",
        "service": "AI-Powered Phishing Detection System",
        "version": "1.0.0",
        "models": {
            "url_model_loaded": url_detector.model is not None,
            "email_model_loaded": email_detector.model is not None
        },
        "database": "connected"
    })

@app.route("/api/scan/url", methods=["POST"])
def scan_url():
    data = request.get_json() or {}
    url = data.get("url", "").strip()

    if not url:
        return jsonify({"error": "URL parameter is required"}), 400

    # Run detection
    result = url_detector.predict(url)

    # Save to database
    try:
        record = ScanRecord(
            scan_type="url",
            target_input=url,
            risk_score=result["risk_score"],
            verdict=result["verdict"],
            confidence=result["confidence"],
            features={
                "details": result["details"],
                "threat_flags": result["threat_flags"]
            }
        )
        db.session.add(record)
        db.session.commit()
        result["id"] = record.id
        result["created_at"] = record.created_at.strftime("%Y-%m-%d %H:%M:%S")
    except Exception as e:
        db.session.rollback()
        print(f"[DB Error] Failed to save URL scan: {e}")

    return jsonify({
        "success": True,
        "result": result
    })

@app.route("/api/scan/email", methods=["POST"])
def scan_email():
    data = request.get_json() or {}
    email_text = data.get("email_text", "").strip()

    if not email_text:
        return jsonify({"error": "Email text content is required"}), 400

    # Run detection
    result = email_detector.predict(email_text)

    # Save to database
    try:
        record = ScanRecord(
            scan_type="email",
            target_input=email_text,
            risk_score=result["risk_score"],
            verdict=result["verdict"],
            confidence=result["confidence"],
            features={
                "details": result["details"],
                "threat_flags": result["threat_flags"]
            }
        )
        db.session.add(record)
        db.session.commit()
        result["id"] = record.id
        result["created_at"] = record.created_at.strftime("%Y-%m-%d %H:%M:%S")
    except Exception as e:
        db.session.rollback()
        print(f"[DB Error] Failed to save Email scan: {e}")

    return jsonify({
        "success": True,
        "result": result
    })

@app.route("/api/stats", methods=["GET"])
def get_stats():
    total_scans = ScanRecord.query.count()
    if total_scans == 0:
        return jsonify({
            "total_scans": 0,
            "phishing_detected": 0,
            "suspicious_detected": 0,
            "safe_detected": 0,
            "threat_rate": 0.0,
            "url_scans_count": 0,
            "email_scans_count": 0,
            "average_risk_score": 0.0
        })

    phishing_count = ScanRecord.query.filter_by(verdict="Phishing").count()
    suspicious_count = ScanRecord.query.filter_by(verdict="Suspicious").count()
    safe_count = ScanRecord.query.filter_by(verdict="Safe").count()
    url_count = ScanRecord.query.filter_by(scan_type="url").count()
    email_count = ScanRecord.query.filter_by(scan_type="email").count()

    # Calculate threat rate (Phishing + Suspicious / Total)
    threat_rate = round(((phishing_count + suspicious_count) / total_scans) * 100, 1)

    # Average risk score
    all_scores = [r.risk_score for r in ScanRecord.query.all()]
    avg_score = round(sum(all_scores) / len(all_scores), 1) if all_scores else 0.0

    return jsonify({
        "total_scans": total_scans,
        "phishing_detected": phishing_count,
        "suspicious_detected": suspicious_count,
        "safe_detected": safe_count,
        "threat_rate": threat_rate,
        "url_scans_count": url_count,
        "email_scans_count": email_count,
        "average_risk_score": avg_score
    })

@app.route("/api/history", methods=["GET"])
def get_history():
    scan_type = request.args.get("type")
    query_param = request.args.get("q")
    limit = min(int(request.args.get("limit", 50)), 100)

    query = ScanRecord.query

    if scan_type and scan_type in ["url", "email"]:
        query = query.filter_by(scan_type=scan_type)

    if query_param:
        query = query.filter(ScanRecord.target_input.ilike(f"%{query_param}%"))

    records = query.order_by(ScanRecord.created_at.desc()).limit(limit).all()
    return jsonify({
        "count": len(records),
        "history": [r.to_dict() for r in records]
    })

@app.route("/api/history/<int:record_id>", methods=["DELETE"])
def delete_record(record_id):
    record = ScanRecord.query.get(record_id)
    if not record:
        return jsonify({"error": "Record not found"}), 404

    db.session.delete(record)
    db.session.commit()
    return jsonify({"success": True, "deleted_id": record_id})

@app.route("/api/history", methods=["DELETE"])
def clear_history():
    num_deleted = db.session.query(ScanRecord).delete()
    db.session.commit()
    return jsonify({"success": True, "deleted_count": num_deleted})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"[*] Starting AI-Powered Phishing Detection API on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=False)
