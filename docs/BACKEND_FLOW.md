# Backend Development Flow: Eco-Pulse

## Overview
This document outlines the step-by-step flow for building the Express.js backend for the Eco-Pulse application. The frontend is already complete and expects specific API endpoints from the backend.

## Architecture Pattern
**Routes → Services → Repositories** (NOT MVC Controllers)

---

## Frontend API Requirements

| Endpoint | Method | Request Body | Response |
|----------|--------|--------------|----------|
| `/api/auth/register` | POST | `{username, email, password, defaultLocation}` | `{token, user}` |
| `/api/auth/login` | POST | `{email, password}` | `{token, user}` |
| `/api/aqi/current` | GET | `?location=Indiranagar` | `{location, aqi, pm25, no2, dominantPollutant, geminiAdvisory: {riskLevel, advisoryMessage}}` |
| `/api/user/history` | GET | - | Array of history entries |
| `/api/user/history` | POST | `{locationSearched, aqiValue, dominantPollutant, aiRiskLevel}` | Saved entry |

---

## Backend Current State

- **Location:** `apps/backend/`
- **Current file:** Only `src/index.js` with basic Express skeleton
- **Missing:** MongoDB connection, models, auth, AQI + Gemini integration, routes
- **Architecture Pattern:** Routes → Services → Repositories

---

## Environment Variables Required

Create `.env` file in `apps/backend/` with the following:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
WAQI_TOKEN=your_waqi_token
GEMINI_API_KEY=your_gemini_key
```

---

## Dependencies to Install

Run from project root:

```bash
pnpm add mongoose bcryptjs jsonwebtoken axios @google/generai --filter backend
```

---

## Phase 1: Setup & Configuration

1. Create `.env` file in `apps/backend/`
2. Install required dependencies
3. Create folder structure

---

## Phase 2: Database Layer

### Folder Structure

```
apps/backend/src/
├── config/
│   └── db.js                 (MongoDB connection)
├── models/
│   ├── User.js               (User schema)
│   └── SearchHistory.js      (History schema)
├── middleware/
│   └── authMiddleware.js     (JWT verification)
├── routes/
│   ├── authRoutes.js
│   ├── aqiRoutes.js
│   └── userRoutes.js
├── services/
│   ├── authService.js        (Business logic for auth)
│   ├── aqiService.js         (Business logic for AQI)
│   ├── geminiService.js      (Gemini AI integration)
│   └── waqiService.js        (WAQI API integration)
├── repositories/
│   ├── userRepository.js     (User data access)
│   └── historyRepository.js  (SearchHistory data access)
└── utils/
    └── validators.js         (Input validation)
```

### Files to Create

1. **`src/config/db.js`** - Connect to MongoDB Atlas
2. **`src/models/User.js`** - Username, email, password (hashed), defaultLocation
3. **`src/models/SearchHistory.js`** - userId ref, locationSearched, aqiValue, dominantPollutant, aiRiskLevel, timestamp

---

## Phase 3: Authentication (JWT)

### Repositories
1. **`src/repositories/userRepository.js`** - User CRUD operations

### Services
1. **`src/services/authService.js`**
   - `register`: Hash password with bcrypt → save user → return user
   - `login`: Find user → compare password → return user
   - `generateToken`: Create JWT token
   - `verifyToken`: Verify JWT token

### Middleware
1. **`src/middleware/authMiddleware.js`**
   - Verify JWT token from Authorization header
   - Attach `req.user` with user data

### Routes
1. **`src/routes/authRoutes.js`**
   - `POST /api/auth/register`
   - `POST /api/auth/login`

---

## Phase 4: External API Integration

### Services
1. **`src/services/waqiService.js`**
   - Fetch AQI data from `api.waqi.info`
   - Extract: AQI, PM2.5, NO2, dominant pollutant
   - Handle errors gracefully

2. **`src/services/geminiService.js`**
   - Generate health advisory using Gemini API
   - Input: PM2.5, NO2, AQI values
   - Output: `{ riskLevel: 1-5, advisoryMessage: "..." }`

3. **`src/services/aqiService.js`**
   - Orchestrate WAQI and Gemini services
   - Return combined response to frontend

### Routes
1. **`src/routes/aqiRoutes.js`**
   - `GET /api/aqi/current?location=Indiranagar`

---

## Phase 5: User History

### Repositories
1. **`src/repositories/historyRepository.js`**
   - `findByUserId`: Get all history for user
   - `create`: Save new search history
   - `findByLocation`: Search by location

### Services
1. **`src/services/userService.js`**
   - `getHistory`: Get user's search history
   - `saveSearch`: Save a new search entry

### Routes
1. **`src/routes/userRoutes.js`**
   - `GET /api/user/history` (protected)
   - `POST /api/user/history` (protected)

---

## Phase 6: Main Entry Point

### Update `src/index.js`

1. Import all routes
2. Connect to MongoDB
3. Mount routes:

```javascript
app.use('/api/auth', authRoutes);
app.use('/api/aqi', aqiRoutes);
app.use('/api/user', userRoutes);
```

---

## Flow Diagram

```
User Request
    ↓
┌─────────────────────────────────────────────────────────┐
│  index.js (Entry)                                      │
│    ↓                                                    │
│  Routes                                                │
│    ↓                                                    │
│  Services (Business Logic)                            │
│    ├─ authService → userRepository → JWT              │
│    ├─ aqiService → waqiService + geminiService        │
│    └─ userService → historyRepository                 │
│    ↓                                                    │
│  Repositories (Data Access)                            │
│    └─ userRepository, historyRepository               │
│    ↓                                                    │
│  Models (Mongoose Schemas)                            │
└─────────────────────────────────────────────────────────┘
    ↓
Response to Frontend
```

---

## Additional Features (Frontend Updates)

### Feature 1: Pollutant Information & Color Coding

**Description:**
- Show informational tooltips/cards explaining each pollutant (PM2.5, NO2, SO2, etc.)
- Color code values based on Indian air quality standards

**Color Coding Thresholds (based on CPCB/NAAQMS India standards):**

| Pollutant | Safe/Green | Warning/Yellow | Dangerous/Red |
|-----------|------------|----------------|---------------|
| PM2.5 (µg/m³) | ≤ 30 | 31-60 | > 60 |
| PM10 (µg/m³) | ≤ 50 | 51-100 | > 100 |
| NO2 (ppb) | ≤ 40 | 41-80 | > 80 |
| SO2 (ppb) | ≤ 20 | 21-80 | > 80 |
| AQI | ≤ 50 | 51-100 | > 100 |

**Files to Update/Create:**

1. **`src/utils/pollutantInfo.js`** - Define pollutant info with descriptions and thresholds
   - PM2.5: "Particulate matter ≤2.5 micrometers in diameter"
   - NO2: "Nitrogen dioxide - caused by vehicle emissions and industrial processes"
   - SO2: "Sulfur dioxide - emitted from burning fossil fuels"
   - AQI: "Air Quality Index - overall air quality indicator"

2. **`src/components/aqi/AqiCard.jsx`** - Update to use pollutant-specific thresholds

3. **New component:** PollutantInfoTooltip - Shows "What is PM2.5?" type info

---

### Feature 2: Comparison Bar Chart

**Description:**
- Add a bar chart in ComparisonView showing pollutant values for both neighborhoods
- Use different colors for each location
- Show all pollutant cards in the comparison section

**Chart Specifications:**
- Type: Grouped Bar Chart
- X-axis: Pollutant types (AQI, PM2.5, NO2)
- Y-axis: Values with unit labels
- Two bars per pollutant (Location 1 vs Location 2)
- Colors: Different colors for each location (e.g., Blue vs Orange)

**Files to Update/Create:**

1. **New component:** `src/components/comparison/ComparisonChart.jsx` - Recharts bar chart
2. **Update:** `src/components/comparison/ComparisonView.jsx` - Add chart and show all pollutant cards
   - Currently shows only AQI card - need to add PM2.5, NO2 cards

---

## Running the Project

After backend is complete, run from project root:

```bash
pnpm dev
```

This starts:
- Frontend → http://localhost:5173
- Backend → http://localhost:5000