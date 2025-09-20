InnoBee Feedback

📝 Full-stack feedback app • 🐍 Flask REST API + 🍃 MongoDB backend • ⚛️ React (Vite) frontend with axios • ✅ Validation + multi-step form (rating → opinion → interest/email → thanks)

Features
	•	POST /api/feedback (JSON only) with robust validation:
	•	rating (int 1–5) required
	•	opinion (≤500 chars) optional
	•	interestedInResearch (boolean) required
	•	email required iff interestedInResearch === true
	•	MongoDB persistence (stores payload + timestamp + IP + user agent)
	•	CORS enabled for local dev (http://localhost:5173)
	•	React (Vite) frontend with axios, loading state, error banner, success screen

⸻

Project structure

.
├─ backend/
│  ├─ app.py
│  ├─ requirements.txt
│  ├─ .env.example
│  └─ (optional) .env         # not committed
└─ frontend/
   ├─ index.html
   ├─ package.json
   └─ src/
      ├─ api/axiosClient.js
      └─ components/
         ├─ FeedBackPage.jsx
         ├─ FeedBackInterest.jsx
         └─ FeedBackThanks.jsx

Quick start

1) Run MongoDB (Docker)
   # If you don't have a Mongo container yet:
   ``` bash
docker run -d --name mongo -p 27017:27017 mongo:7
```
# If you already created it before and it's stopped:
docker start mongo

2) Backend (Flask)

```bash
cd backend

# (first time) create venv and install deps
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

# configure env (copy example to real .env)
cp .env.example .env
# .env defaults:
# MONGO_URI=mongodb://localhost:27017
# MONGO_DB=feedback_db
# MONGO_COLLECTION=feedback
# PORT=5050

# run
python app.py
# → Running on http://0.0.0.0:5050
# Health check in browser: http://localhost:5050/health
```
3) Frontend (Vite + React)
```bash
cd frontend
npm install
npm run dev
# → Local: http://localhost:5173
```
The frontend posts directly to http://localhost:5050/api/feedback (CORS is enabled server-side). No Vite proxy needed.


API usage

Endpoint

POST /api/feedback
Content-Type: application/json

Request (client brief shape accepted by the backend)

```bash
{
  "rating": 4,
  "improvementText": "The UI could be more intuitive on mobile.",
  "interestedInResearch": true,
  "email": "user@example.com"
}
```
cURL test
```bash
curl -i -X POST http://localhost:5050/api/feedback \
  -H "Content-Type: application/json" \
  -d '{"rating":5,"improvementText":"Hi","interestedInResearch":true,"email":"test@example.com"}'
```
Expected: 201 Created with {"message":"Feedback accepted","id":"<mongo_id>"}.

Errors (400)
	•	Missing rating, out of range rating, opinion > 500, interestedInResearch not chosen, or missing/invalid email when interested → returns:
 ```bash
{"error": "...", "field": "<name>"}.
```



