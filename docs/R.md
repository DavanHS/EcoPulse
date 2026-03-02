# Role 3: Frontend & UI/UX Lead (React)

## 📌 The Mission
You are the face of Eco-Pulse. Your job is to take the raw numbers and AI insights from the backend and turn them into a sleek, responsive Single Page Application (SPA). You need to make sure the app doesn't just work, but looks modern and responds instantly, hiding any backend latency behind smooth loading states.

## 🛠️ Core Responsibilities

### 1. Component Architecture & UI Building
* **The Scaffold:** Initialize the app using Vite (skip Create React App; Vite is significantly faster and the modern standard).
* **Tailwind CSS:** Style everything rapidly with Tailwind utility classes. Build reusable UI components like metric cards for **PM2.5** and **NO2**, and a prominent alert banner for the Gemini health advisory.
* **Bengaluru Showdown View:** Create the dual-column comparison UI where users can stack up neighborhoods (e.g., Mathikere vs. Indiranagar) side-by-side to see the clear winner.

### 2. State Management & API Consumption
* **Fetching Data:** Use Axios or the native Fetch API to hit your team's Express endpoints. 
* **Handling Latency:** You are responsible for the UI's loading states. Show skeleton loaders or a sleek spinner while the WAQI API and Gemini are "thinking," and gracefully display an error state if the server request fails.
* **Auth State:** Manage the JWT token received upon login. Store it securely and attach it to the `Authorization` header of every protected request (like saving a historical search to the database).

### 3. Client-Side Routing (React Router)
* Set up seamless navigation without page reloads.
    * `/` (Home / Public Search)
    * `/login` & `/register`
    * `/history` (Protected route: only accessible if the user has a valid session token; redirects to `/login` if not).

### 4. Data Visualization (The Resume Booster)
* Integrate a lightweight charting library like Recharts or Chart.js. Take the historical array sent by the backend and map out the user's AQI exposure trends over the week in a clean line graph.

## 📦 Key Deliverables
* [ ] A fully functional Vite + React application hooked up to Tailwind.
* [ ] `AuthContext` setup for managing global user login state.
* [ ] Reusable UI components: `<AqiCard />`, `<GeminiAdvisory />`, `<LocationSelect />`.
* [ ] Implementation of React Router with protected routes.

## ⚙️ Tools & Tech
* **React (via Vite)**
* **Tailwind CSS**
* **React Router DOM**
* **Axios**
* **Recharts or Chart.js**