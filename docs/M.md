# Role 1: Database & Data Architect (MongoDB)

## 📌 The Mission
You are the gatekeeper of the data. Your job is to design, deploy, and manage the MongoDB database, ensuring data flows efficiently and securely to the Express backend. You are not just creating tables; you are structuring how Eco-Pulse understands users, their locations, and their historical pollution exposure.

## 🛠️ Core Responsibilities

### 1. Schema Design & Data Modeling (Mongoose)
Design robust, scalable schemas using Mongoose. You need to think about how data relates and how to prevent garbage data from entering the system.
* **`User` Schema:** Handle authentication data (hashed passwords, emails) and user preferences (e.g., default Bengaluru neighborhood, preferred indoor workouts like push-ups/squats for the AI context).
* **`SearchHistory` Schema:** Log every AQI query made by a user. Must include location, timestamps, raw AQI data ($PM_{2.5}$, $NO_2$), and the AI-generated risk assessment.

### 2. Database Deployment & Management
* Set up and configure a **MongoDB Atlas** cluster (the free tier is perfect here).
* Manage environment variables (`MONGO_URI`) securely.
* Configure network access (IP whitelisting) and database user privileges.

### 3. Data Validation & Indexing
* Write strict Mongoose validation rules (e.g., ensuring emails are properly formatted, AQI values are numbers, passwords meet length requirements before hashing).
* Create database indexes on frequently queried fields (like `userId` and `timestamp` in the SearchHistory collection) so the app doesn't freeze when loading a user's dashboard.

### 4. Seed Data & API Payload Structuring
* Create a seeding script to populate the database with dummy users and historical AQI data so the frontend (React) team can start building charts immediately without waiting for real user data.
* Work closely with the Express developer to structure the exact JSON objects that will be saved to the database from the WAQI and Gemini API responses.

## 📦 Key Deliverables
* [ ] Live MongoDB Atlas URI shared securely with the team.
* [ ] `models/User.js` with complete schema and validation.
* [ ] `models/SearchHistory.js` with complete schema and validation.
* [ ] `seed.js` script to generate 50+ fake historical searches for dashboard testing.

## ⚙️ Tools & Tech
* **MongoDB Atlas** (Cloud Database)
* **Mongoose** (Object Data Modeling for Node.js)
* **MongoDB Compass** (GUI for visualizing the data during development)