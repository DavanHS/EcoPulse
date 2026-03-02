# Product Requirements Document (PRD): Eco-Pulse

## 1. Project Overview

**Name:** Eco-Pulse
**Description:** A full-stack, AI-driven environmental health monitor. It aggregates real-time air quality data and leverages LLMs to provide hyper-localized, actionable health and fitness advisories.
**Objective:** Build a robust MERN stack application demonstrating external API integration, AI prompt engineering, secure user authentication, and responsive data visualization.

## 2. Core Features (Resume-Worthy Scope)

* **JWT Authentication:** Secure user signup and login. Users must have an account to save locations and view history.
* **Real-Time AQI Dashboard:** Dynamic UI displaying $PM_{2.5}$, $NO_2$, and overall AQI for searched locations.
* **AI Health & Fitness Advisor:** Gemini API analyzes the raw pollutant data and generates personalized advice (e.g., *"High $PM_{2.5}$ in Mathikere today. Swap the outdoor run for an indoor routine of push-ups and squats to minimize respiratory strain."*).
* **Bengaluru Location Showdown:** Side-by-side comparison of two localities (e.g., Indiranagar vs. Whitefield) highlighting the safer zone for outdoor activities.
* **User Dashboard & History (MongoDB):** Users can save their default location and view a logged history of their AQI queries to track seasonal pollution trends.

## 3. Tech Stack

* **Frontend:** React, Tailwind CSS, Axios (for API calls), Recharts or Chart.js (for visualizing $PM_{2.5}$ trends).
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB, Mongoose (ODM).
* **Security:** `bcryptjs` (password hashing), `jsonwebtoken` (auth tokens), `dotenv` (environment variables).
* **External APIs:**
* **Air Quality:** WAQI (World Air Quality Index) API for reliable Indian city data.
* **AI Engine:** Gemini API (`@google/genai`) for health inferences.



## 4. System Architecture & Data Flow

1. **Client:** React handles the UI and manages global state (e.g., using Context API or Redux for user sessions).
2. **API Gateway:** Express routes handle requests. Protected routes require a valid JWT.
3. **Data Aggregation Layer:** When a user searches a location, Express concurrently hits the WAQI API and queries MongoDB for the user's past searches in that area.
4. **AI Processing:** Express formats the WAQI payload into a structured prompt for Gemini, requesting a specific output format (e.g., JSON) containing a risk level (1-5) and a 2-sentence actionable advisory.
5. **Persistence:** The search query, timestamp, and Gemini's risk assessment are saved to the user's document in MongoDB.
6. **Response:** The aggregated package (Current AQI, AI Advisory, Historical Trend) is returned to the React frontend.

## 5. Database Schema (MongoDB / Mongoose)

To prove database proficiency, you need at least two interacting collections.

* **User Schema:**
* `_id`, `username`, `email`, `password` (hashed).
* `defaultLocation` (String).


* **SearchHistory Schema:**
* `_id`, `userId` (Ref: User).
* `locationSearched` (String).
* `aqiValue` (Number).
* `dominantPollutant` (String, e.g., $PM_{2.5}$).
* `aiRiskLevel` (Number).
* `timestamp` (Date).



## 6. Future Scope (Bonus Points for Resume)

* **Redis Caching:** Implement Redis on the backend to cache WAQI responses for 10 minutes per location, significantly reducing API calls and latency.
* **Automated Email Alerts:** A cron job that emails the user a morning AQI briefing for their saved default location.