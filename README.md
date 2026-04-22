# 🏆 Dynamic Leaderboard Ranking System

A real-time leaderboard REST API with live rankings, score velocity tracking, auto badges, advanced statistics, performance monitoring, and full submission history, built with Node.js, React, MongoDB Atlas, and Docker.

---

##  Live Demo

- **Link:** https://creative-cajeta-d2db51.netlify.app/

---

## What Makes This Unique

Most leaderboards just store a name and a score. We went far beyond that.

### Auto Badge System
Every player is automatically assigned a badge based on their live rank, no manual input needed. Badges update instantly whenever scores change.

| Rank | Badge |
|------|-------|
| #1 | Legend |
| #2 - #3 | Elite |
| #4 - #10 | Top 10 |
| Rest | Player |

### Score Velocity Tracking
We track how fast a player is climbing or falling on the leaderboard. Every time a score is updated, we calculate the difference from the previous score and display it as a green ▲ or red ▼ indicator. This gives the leaderboard a live, dynamic feel, not just a static list.

### Percentile Rank Auto-Calculation
Every player gets a live percentile rank (e.g. "Top 4.8%") that is recalculated automatically after every single submission using MongoDB bulk operations. No manual triggers needed.

### Score Distribution Chart
The `/info` endpoint goes beyond basic stats, it computes mean, median, standard deviation, quartiles, IQR, min, max, and a full score distribution bucketed into 5 ranges, rendered as a live bar chart on the frontend.

###  Real-Time Performance Monitoring
A custom middleware tracks the average response time (in milliseconds) for every single API endpoint, updated in real-time with every request. Judges can visit `/performance` and see exactly how fast each endpoint responds.

### Full Submission History with Timestamps
Every score submission is logged with a `lastSubmittedAt` timestamp that updates on every re-submission, not just on first insert. The `/history` endpoint supports filtering by username and date range.

### Auto-Refresh Every 5 Seconds
The leaderboard, performance, and history panels all auto-refresh using React Query polling, giving a live, real-time feel without any manual refresh needed.

### Multi-Page Navigation
Full React Router implementation with 7 dedicated pages, Home, Leaderboard, Add, Remove, Stats, Performance, History, each with smooth transitions powered by Framer Motion animations.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/add` | Add or update a leaderboard entry |
| DELETE | `/remove` | Remove an entry by username |
| GET | `/leaderboard` | Get top 10 entries with badges, velocity, percentile |
| GET | `/info` | Get advanced statistics and score distribution |
| GET | `/performance` | Get real-time API response time per endpoint |
| GET | `/history` | Get full submission history with timestamp filters |

---

## System Architecture

Our system is built in 4 layers, User, Frontend, Backend, and Database, all containerized with Docker.

### Layer 1 - User / Browser
The user interacts with our React frontend through a browser. Every action (adding a score, viewing the leaderboard, checking stats) triggers an HTTP request to our backend via Axios.

### Layer 2 - Frontend (React + Tailwind CSS)
The frontend is a multi-page React application served via Nginx inside a Docker container on port 3000.

- **React** : Component-based UI framework
- **Tailwind CSS** : Utility-first styling for a clean dark UI
- **Framer Motion** : Smooth animations on page load and transitions
- **React Query** : Auto-fetches and caches API data, polling every 5 seconds for live updates
- **Axios** : Handles all HTTP requests to the backend REST API
- **React Router DOM** : Multi-page navigation with 7 dedicated routes

Pages: Home · Leaderboard · Add · Remove · Stats · Performance · History

### Layer 3 - Backend (Node.js + Express.js)
The backend is a Node.js REST API server running inside a Docker container on port 5000.

**Middleware Stack:**
- **Morgan** : HTTP request logger, logs every incoming request
- **CORS** : Allows cross-origin requests from the frontend
- **Performance Middleware** : Custom-built middleware that tracks average response time per endpoint using `process.hrtime.bigint()` for nanosecond precision
- **dotenv** : Loads environment variables from `.env`
- **express-async-handler** : Clean async error handling across all routes

**REST API Routes:**
- `POST /add` : Validates score (rejects negatives, -0, NaN, Infinity), saves entry, triggers full rank recalculation via MongoDB bulkWrite, assigns badge and percentile
- `DELETE /remove` : Removes player, triggers rank recalculation
- `GET /leaderboard` : Returns top 10 sorted by score with rank, badge, velocity, percentile
- `GET /info` : Computes mean, median, Q1, Q3, IQR, std deviation, min, max, score distribution buckets
- `GET /performance` : Returns in-memory performance stats per endpoint
- `GET /history` : Returns full submission log sorted by `lastSubmittedAt`, supports username and date range filters

**Swagger UI** is auto-served at `/api-docs` using `swagger-ui-express` and `swagger-jsdoc`, providing full interactive OpenAPI 3.0 documentation.

### Layer 4 - Database (MongoDB Atlas)
We use MongoDB Atlas free tier as our cloud database, connected via Mongoose ODM.

**Entry Schema:**
```
username        - Unique player identifier
score           - Current score (validated: no negatives, no -0, no NaN)
rank            - Auto-calculated position
percentileRank  - Auto-calculated top percentage
velocity        - Score change from last submission (+ climbing, - falling)
scoreHistory    - Array of all previous scores
tag             - Auto-assigned badge (Legend / Elite / Top 10 / Player)
submissionCount - Total number of submissions
lastSubmittedAt - Timestamp of most recent score update
ipAddress       - IP address of submitter
createdAt       - First submission timestamp (auto)
updatedAt       - Last document update timestamp (auto)
```

After every `/add` or `/remove`, we run a `bulkWrite` operation that recalculates rank, percentile, and badge for every player in a single atomic database operation, no loops, no N+1 queries.

### Layer 5 - Docker + Docker Compose
Both the frontend and backend are containerized using Docker and orchestrated with Docker Compose.

**Backend Dockerfile** : Node 18 Alpine image, installs dependencies, runs `node server.js`

**Frontend Dockerfile** : Multi-stage build:
- Stage 1: Node 18 Alpine builds the React app (`npm run build`)
- Stage 2: Nginx Alpine serves the production build as static files

**docker-compose.yml** : Spins up both services together:
- `backend` service on port 5000
- `frontend` service on port 3000
- Environment variables injected at runtime
- `restart: always` for automatic recovery

Single command to run the entire stack:
```bash
docker-compose up --build
```

---

## Team

1. Bhavya Parekh 
2. Nirav Chauhan
3. Henil Patel


   
Built at **Luddy Hacks Hackathon 2026 at Indiana University Bloomington**

---

