"""
Feedback API — Flask + MongoDB

Purpose
-------
POST /api/feedback accepts a single JSON payload with rating/opinion/research opt-in/email.
We accept EITHER:
 A) Canonical schema (server-first):
    {
      "rating": 1..5,                             # required
      "opinion": "string <= 500",                 # optional
      "research_optin": "not_interested|interested",  # required
      "email": "user@example.com"                 # required if interested
    }

 B) Client-given schema (test brief example):
    {
      "rating": 1..5,                             # required
      "improvementText": "string <= 500",         # optional
      "interestedInResearch": true|false,         # required
      "email": "user@example.com"                 # required if true
    }

We normalize B -> A internally so both work.

Success: 201 + {"message": "...", "id": "<mongo_id>"}
Errors:  400 with {"error": "...", "field": "<field>"}
"""

import os
import re
import datetime
from typing import Dict, Any

from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

# --- Config / Env ---
MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB = os.environ.get("MONGO_DB", "feedback_db")
MONGO_COLLECTION = os.environ.get("MONGO_COLLECTION", "feedback")
PORT = int(os.environ.get("PORT", 5050))

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}})

client = MongoClient(MONGO_URI)
db = client[MONGO_DB]
col = db[MONGO_COLLECTION]

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def err(field: str, message: str, code: int = 400):
    return jsonify({"error": message, "field": field}), code


def normalize_payload(p: Dict[str, Any]) -> Dict[str, Any]:
    """
    Accept both shapes and normalize to canonical keys:
      rating, opinion, research_optin, email
    """
    if not isinstance(p, dict):
        raise ValueError(("body", "Request body must be a JSON object"))

    # rating
    if "rating" not in p:
        raise ValueError(("rating", "Field 'rating' is required"))
    rating = p["rating"]
    if not isinstance(rating, int):
        raise ValueError(("rating", "Field 'rating' must be an integer"))
    if not (1 <= rating <= 5):
        raise ValueError(("rating", "Field 'rating' must be between 1 and 5"))

    # opinion / improvementText
    opinion = p.get("opinion", p.get("improvementText"))
    if opinion is not None:
        if not isinstance(opinion, str):
            raise ValueError(("opinion", "Opinion must be a string"))
        if len(opinion) > 500:
            raise ValueError(("opinion", "Opinion must be at most 500 characters"))

    # research opt-in: server enum OR client boolean
    research_optin = p.get("research_optin")
    interested_bool = p.get("interestedInResearch")

    if research_optin is None and interested_bool is None:
        raise ValueError(("research_optin", "Provide 'research_optin' or 'interestedInResearch'"))

    if research_optin is not None:
        if research_optin not in {"not_interested", "interested"}:
            raise ValueError(("research_optin", "Must be 'not_interested' or 'interested'"))
    else:
        research_optin = "interested" if bool(interested_bool) else "not_interested"

    # email rule depends on interest
    email = p.get("email")
    if research_optin == "interested":
        if not email:
            raise ValueError(("email", "Email is required when 'interested'"))
        if not isinstance(email, str) or not EMAIL_RE.match(email):
            raise ValueError(("email", "Email must be a valid address"))
    else:
        # normalize to None if not interested
        email = None

    return {
        "rating": rating,
        "opinion": opinion,
        "research_optin": research_optin,
        "email": email,
    }


@app.post("/api/feedback")
def create_feedback():
    if not request.is_json:
        return err("body", "Content-Type must be application/json")

    payload = request.get_json(silent=True)
    try:
        data = normalize_payload(payload)
    except ValueError as ve:
        field, msg = ve.args[0]
        return err(field, msg, 400)

    doc = {
        **data,
        "created_at": datetime.datetime.utcnow(),
        "ip": request.headers.get("X-Forwarded-For", request.remote_addr),
        "user_agent": request.headers.get("User-Agent"),
    }

    try:
        result = col.insert_one(doc)
    except Exception:
        return err("server", "Failed to save feedback. Please try again later.", 500)

    return jsonify({"message": "Feedback accepted", "id": str(result.inserted_id)}), 201


@app.get("/health")
def health():
    return jsonify({"status": "ok"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT)