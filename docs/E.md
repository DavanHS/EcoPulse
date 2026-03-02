# Role 2: Backend & AI Integration Lead (Express.js / Node.js)

## 📌 The Mission
You are the brain of Eco-Pulse. Your server is the secure middleman that ensures the frontend never touches your sensitive API keys. You are responsible for fetching real-world data, feeding it to an AI to generate intelligent health advisories, and packaging that up neatly for the React client.



## 🛠️ Core Responsibilities

### 1. API Orchestration & External Integrations
* **WAQI Integration:** Write the asynchronous functions (using Axios or the native `fetch` API) to hit the World Air Quality Index API. You need to parse the raw JSON to extract exactly what the app needs: $PM_{2.5}$, $NO_2$, and the overall AQI integer.
* **Error Handling:** External APIs fail. If WAQI goes down or a specific Bengaluru station is offline, your server must catch the error and send a clean fallback response to the frontend, not crash the entire app.

### 2. AI Prompt Engineering (Gemini API)
* **The AI Wrapper:** Integrate the `@google/genai` SDK.
* **Contextual Prompting:** Build dynamic prompt templates that inject the live WAQI data. 
  * *Example Prompt:* "The current $PM_{2.5}$ in Mathikere is 150. The user's profile indicates they usually do outdoor runs. Write a strict 2-sentence health advisory recommending an indoor alternative."
* **Response Formatting:** Force Gemini to return a structured response (like a JSON object containing a `riskLevel` integer and an `advisoryMessage` string) so the frontend can easily render it.

### 3. Routing & Controllers (Express)
* Set up clear, RESTful API endpoints.
  * `POST /api/auth/register` and `/api/auth/login`
  * `GET /api/aqi/current?location=Indiranagar`
  * `POST /api/user/history` (to save a search)
* Keep your routes clean by pushing the heavy logic into dedicated controller files.

### 4. Authentication & Security (JWT)
* Implement `bcryptjs` to hash user passwords before they ever touch the MongoDB models built by your database architect.
* Generate and verify JSON Web Tokens (JWT). Write a custom middleware function to protect routes (like saving a location) so only logged-in users can access them.

## 📦 Key Deliverables
* [ ] A running Node/Express server (`server.js`).
* [ ] `.env` file management for `GEMINI_API_KEY`, `WAQI_TOKEN`, `MONGO_URI`, and `JWT_SECRET`.
* [ ] `controllers/aqiController.js` handling the WAQI and Gemini logic.
* [ ] `middleware/authMiddleware.js` for verifying JWTs.
* [ ] Fully tested API endpoints (using Postman or Bruno) ready for the frontend team to consume.

## ⚙️ Tools & Tech
* **Node.js & Express.js**
* **@google/genai** (Gemini SDK)
* **Axios**
* **jsonwebtoken & bcryptjs**