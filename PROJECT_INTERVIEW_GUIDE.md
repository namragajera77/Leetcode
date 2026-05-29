# PROJECT INTERVIEW GUIDE

This document explains the Major Project (LEETCODE clone) codebase so you can confidently present it in interviews. Explanations reference real files and concrete implementation details found in the repository.

---

**Contents**
- 1. Project Overview
- 2. Tech Stack
- 3. Folder Structure
- 4. Architecture Explanation
- 5. Authentication & Authorization
- 6. Database Design
- 7. APIs
- 8. Core Features Deep Explanation
- 9. Code Execution System
- 10. DSA & Algorithms Used
- 11. Important Components/Classes
- 12. State Management
- 13. Security Features
- 14. Performance Optimization
- 15. Challenges Faced
- 16. Future Improvements
- 17. Interview Questions & Answers
- 18. Resume Explanation
- 19. System Design Perspective
- 20. Deployment
- 21. Complete Request Lifecycle
- 22. Important Concepts Used
- 23. Project Summary for Revision
- 24. Diagrams (Markdown)

---

**1. Project Overview**
- **Project name:** Major Project LEETCODE (repo root)
- **Purpose:** A LeetCode-style platform to create problems, run code, submit solutions, view reference solutions and videos, and use an AI-assisted doubt solver.
- **Real-world problem solved:** Provides a platform for practicing algorithmic problems with judge integration, editor, submissions tracking, and editorial videos.
- **Main features:**
  - Problem creation and management (backend: `backend/src/controllers/userProblem.js`)
  - Code editor with run/submit (frontend: `frontend/src/pages/ProblemPage.jsx`)
  - Code execution via Judge0 API (backend: `backend/src/utils/problemUtility.js`)
  - Authentication with JWT and cookies (backend: `backend/src/controllers/userauthent.js`)
  - Submission tracking (models: `backend/src/models/submission.js`, controller: `usersubmission.js`)
  - Solution videos with Cloudinary (controllers: `backend/src/controllers/videoSection.js`)
  - AI chat for doubt solving (controller: `backend/src/controllers/solveDoubt.js`)
- **Target users:** Students / interview prep users / educators.
- **High-level workflow:**
  1. User registers/logs in -> JWT stored in cookie (`/user/register`, `/user/login`, `backend/index.js`).
  2. User opens a problem page (`/problem/problemById/:id`) -> frontend loads problem and start code (`frontend/src/pages/ProblemPage.jsx`).
  3. User writes code in Monaco editor and clicks Run or Submit -> frontend calls `/submission/run/:id` or `/submission/submit/:id` (frontend uses `frontend/src/utils/axiosClient.js`).
  4. Backend prepares submissions, optionally wraps user code with a language-specific driver (`backend/src/utils/codeWrapperGenerator.js`, `backend/src/utils/codeMerger.js`), sends to Judge0 via `problemUtility.js`, polls tokens, and returns results.

**2. Tech Stack**
- **Frontend:** React (Vite), Monaco Editor (`@monaco-editor/react` used in `ProblemPage.jsx`), Redux Toolkit (`frontend/src/store` + `authSlice.js`) — chosen for responsive SPA and predictable state.
- **Backend:** Node.js + Express (`backend/index.js`) for lightweight REST APIs and middleware.
- **Database:** MongoDB via Mongoose (`backend/src/config/db.js`, models in `backend/src/models`) — flexible document storage suitable for varying problem/testcase schemas.
- **Authentication:** JWT stored in cookies; JWT creation in `userauthent.js`, verification in middleware (`backend/src/middleware/usermiddleware.js`, `adminmiddleware.js`).
- **Code Execution / Judge:** Judge0 public API via RapidAPI (`backend/src/utils/problemUtility.js`). Code merging/wrappers in `codeWrapperGenerator.js` and `codeMerger.js`.
- **State Management:** Redux Toolkit (`frontend/src/authSlice.js`) for auth state; local component state + localStorage for editor persistence in `ProblemPage.jsx`.
- **Deployment / Dev tools:** dotenv for configs (`.env` expected), Redis (`backend/src/config/redis.js`) used as token blocklist, Cloudinary for video hosting (`videoSection.js`).
- **Libraries:** bcrypt for hashing, jsonwebtoken, axios, cloudinary, validator, redis, mongoose, groq/generative AI SDK for the AI chat.

Why used (short):
- React/Monaco = rich code editor UX. Redux = centralized auth state. Express/Mongo = quick API + flexible schemas. Judge0 = existing safe judge. Cloudinary = managed video storage.

**3. Folder Structure**
- Top-level: `backend/`, `frontend/`, `dsa-visualizer code/` (a separate visualizer app).
- Backend important files:
  - `backend/index.js` — express bootstrap, routers wired.
  - `backend/src/config/db.js` — MongoDB connection.
  - `backend/src/config/redis.js` — Redis client.
  - `backend/src/models/` — `problem.js`, `user.js`, `submission.js`, `solutionVideo.js`.
  - `backend/src/routers/` — `userauth.js`, `problemcreator.js`, `submit.js`, `aiChatting.js`, `videoCreator.js`.
  - `backend/src/controllers/` — `userauthent.js`, `userProblem.js`, `usersubmission.js`, `solveDoubt.js`, `videoSection.js`.
  - `backend/src/middleware/` — `usermiddleware.js`, `adminmiddleware.js`.
  - `backend/src/utils/` — `codeMerger.js`, `codeWrapperGenerator.js`, `problemUtility.js`, `validator.js`.
- Frontend important files:
  - `frontend/src/main.jsx` — app root and router.
  - `frontend/src/App.jsx` — routes and auth guard.
  - `frontend/src/pages/ProblemPage.jsx` — core editor & run/submit UI.
  - `frontend/src/utils/axiosClient.js` — base URL and withCredentials.
  - `frontend/src/authSlice.js` — Redux authentication logic.

Routing summary:
- Backend endpoints are prefixed in `backend/index.js`: `/user`, `/problem`, `/submission`, `/ai`, `/video`.
- Frontend routes in `frontend/src/App.jsx` map to pages (home, login, problem, admin routes).

**4. Architecture Explanation**
- **Frontend architecture:** Component-based React SPA with React Router. `ProblemPage.jsx` orchestrates editor, language selection, run/submit flows, and local persistence. Redux holds auth state and async thunks manage API calls (`authSlice.js`). Monaco Editor holds code; localStorage persists code per problem+language.
- **Backend architecture:** Express routers delegate to controllers. Controllers use models (Mongoose) and utilities (code wrapper, problemUtility) to prepare and judge code.
- **Request-response flow:** Browser -> `axiosClient` -> Express route -> middleware verifies JWT (if required) -> controller prepares data -> calls utilities (Judge0) -> DB updates -> response.
- **Client-server communication:** JSON over HTTP; cookies carry JWT for auth (see `axiosClient` with `withCredentials:true`).
- **API flow & DB interaction:** Controllers read/write through Mongoose models; e.g., `usersubmission.usersubmission` creates a Submission record, sends code to Judge0, updates submission record with status, runtime, memory.
- **Authentication flow:** Cookies with JWT set at login/register (`res.cookie('token', token)` in `userauthent.js`) → middleware reads `req.cookies.token`, verifies, checks Redis blocklist.
- **Execution flow of coding submissions:** `ProblemPage` triggers `/submission/run/:id` or `/submission/submit/:id` -> backend uses `prepareSubmissions` (merging wrapper + tests) -> `submitBatch` posts to Judge0 -> `submitToken` polls token results -> backend computes test pass counts and persists.

Simple architecture explanation:
- Browser (React + Monaco) ⇄ Express API (JWT + Redis) ⇄ MongoDB (data) and Judge0 (code execution).

Interview-friendly architecture explanation:
- Frontend focuses on UX and local caching; backend keeps concerns separated (auth, problem management, execution). Code execution is delegated to Judge0 to avoid managing sandboxing yourself; wrapper generator standardizes LeetCode-style APIs.

**5. Authentication & Authorization**
- **Login/signup implementation:** `backend/src/controllers/userauthent.js` implements `register` and `login`. On successful auth a JWT is signed with `process.env.JWT_KEY` and sent as cookie: `res.cookie('token', token, {maxAge: ...})`.
- **JWT/session/cookies:** JWT used as session token in cookie; server verifies with `jwt.verify(token, process.env.JWT_KEY)` in `usermiddleware.js` and `adminmiddleware.js`.
- **Password hashing:** bcrypt hashing on registration: `req.body.password = await bcrypt.hash(password, 10)`.
- **Middleware usage & protected routes:** Routes are protected by `usermiddleware` or `adminmiddleware` (e.g., `problemRouter.post('/create', adminmiddleware, createProblem)`).
- **Role-based access:** `adminmiddleware` checks `payload.role === 'admin'` and blocks non-admins.
- **Token verification flow:** `usermiddleware` reads token from cookies, verifies JWT, then checks Redis for `token:${token}` existence to deny logged-out/blocked tokens.

**6. Database Design**
- Using Mongoose (MongoDB). Main models are `User`, `Problem`, `Submission`, `SolutionVideo` in `backend/src/models`.

- `User` (`backend/src/models/user.js`) fields:
  - `firstname`, `lastname`, `emailid` (unique, immutable), `age`, `role` (user/admin), `problemSolved` (array of `Problem` ObjectIds), `password` (hashed). Timestamps enabled.

- `Problem` (`backend/src/models/problem.js`) fields:
  - `title`, `description`, `difficulty` (enum), `tags` (enum), `visibleTestCases` (array of {input, output, explanation}), `hiddenTestCases` (array of {input, output}), `referenceSolution` (language + completeCode), `startCode` (language + initialCode), `functionMetadata` for LeetCode-style signature, and `problemCreator` (ref `user`).

- `Submission` (`backend/src/models/submission.js`) fields:
  - `userId` (ref user), `problemId` (ref problem), `code`, `language` (enum), `status` (pending/accepted/wrong/error), runtime, memory, errorMessage, `testCasesPassed`, `testCasesTotal`. Index on `{userId:1,problemId:1}` for fetches.

- `SolutionVideo` stores Cloudinary metadata for videos: `problemId`, `userId`, `cloudinaryPublicId`, `secureUrl`, `thumbnailUrl`, `duration`.

Relationships:
- `User` <-> `Submission` by userId.
- `Problem` <-> `Submission` by problemId.
- `Problem` <-> `SolutionVideo` by problemId.

Design rationale: flexible document schemas allow variable-length testcases and language-specific metadata.

**7. APIs**
Below is a concise API table (controller + router mapping):

| Endpoint | Method | Purpose | Request Body | Response | Auth |
|---|---:|---|---|---|---|
| `/user/register` | POST | Register new user | `{firstname,emailid,password,...}` | user + message | No |
| `/user/login` | POST | Login user | `{emailid,password}` | user + message | No |
| `/user/logout` | POST | Logout (sets token block in Redis) | none | message | Yes (cookie) |
| `/user/check` | GET | Verify token & get user | none | user | Yes |
| `/problem/create` | POST | Create problem (admin) | problem object | message | Admin |
| `/problem/update/:id` | PUT | Update problem (admin) | problem object | message | Admin |
| `/problem/delete/:id` | DELETE | Delete problem (admin) | none | message | Admin |
| `/problem/problemById/:id` | GET | Fetch full problem | none | problem object (+video fields when present) | User |
| `/problem/getAllProblem` | GET | Paginated list | ?page | problems[] | User |
| `/submission/run/:id` | POST | Run visible testcases | `{code,language}` | test case results | User |
| `/submission/submit/:id` | POST | Submit on hidden testcases | `{code,language}` | accepted/metrics | User |
| `/submission/userSubmission` | GET | Get user's submissions | none | submissions[] | User |
| `/ai/chat` | POST | AI doubt solving | `{messages,title,description,...}` | AI response | User |
| `/video/create/:problemId` | GET | Generate Cloudinary upload signature | none | signature metadata | Admin |
| `/video/save` | POST | Save video metadata after upload | `{problemId,cloudinaryPublicId,secureUrl,duration}` | saved record | Admin |

Validation & errors:
- Input validation uses `validator.js` for email/password checks in auth. Controllers also verify required fields and return 4xx on missing data; server errors return 500.
- Status codes are conventional: 200 success, 201 created, 400 bad request, 401 unauthorized, 404 not found, 500 server error.

**8. Core Features Deep Explanation**
- Coding problem management (`userProblem.js`): Admins create problems. Before storing, controller runs reference solutions against visible testcases using `submitBatch` + `submitToken` (integration test) to ensure reference solutions pass. It uses `getLanguageById` for Judge0 language mapping.
- Code editor (`frontend/src/pages/ProblemPage.jsx`): Monaco Editor used, localStorage persists code per problem+language. Language switch sets start code from `problem.startCode`.
- Code execution system: see Section 9.
- Test case validation & submission handling: `usersubmission.js` creates a Submission doc with status pending, prepares per-test-case submissions using `prepareSubmissions` (which calls wrapper generator if functionMetadata present), posts batch to Judge0, polls results, aggregates runtime/memory/passed count and updates DB.
- Leaderboard/contest system: Not implemented. (Search repo: no leaderboard or contest controllers.)
- User profile: `userauthent.profiledelete` deletes user and submissions (attempted `submissions.deleteMany({userid})` — note bug: variable name mismatch; should be `{ userId: userId }`).
- Discussion/forum feature: Not implemented.
- Search/filter: Basic problem pagination & listings in `getAllProblem` (page query param). No advanced search implemented.
- Compiler/execution pipeline: See Section 9.
- Real-time features: Not implemented (no WebSocket code).

Edge cases handled:
- Login/register missing fields -> 400.
- Judge0 statuses checked and various errors mapped to messages in `userProblem.updateproblem`.
- Redis token blocklist prevents reuse of logged-out tokens.

Optimizations used:
- Batch submissions to Judge0 for multiple testcases to reduce HTTP overhead.

**9. Code Execution System**
- Judge0 integration is implemented in `backend/src/utils/problemUtility.js`.
- Flow:
  1. `prepareSubmissions` (in `codeMerger.js`) creates per-test-case objects: `{ source_code, language_id, stdin, expected_output }`.
  2. `submitBatch` posts them to `https://judge0-ce.p.rapidapi.com/submissions/batch` with required RapidAPI headers (`process.env.JUDGE0_KEY`).
  3. `submitToken` polls `/submissions/batch` with tokens until all `status_id > 2` (finished) and returns details.
- Sandboxing/security: Execution is offloaded to Judge0 — an external sandbox. The app relies on Judge0 safety. No local sandboxing is implemented.
- Supported languages: Mapped in `getLanguageById` — C++ (54), Java (62), JavaScript (63). The frontend presents `javascript`, `java`, `cpp`.
- Input/output handling: Wrapper generators produce code that reads stdin and prints output consistently (`codeWrapperGenerator.js`). For LeetCode-style problems, `functionMetadata` drives wrapper generation.
- Custom & hidden test cases: Visible: `visibleTestCases` used for Run. Hidden: `hiddenTestCases` used for Submit. Both are arrays in `problem.js`.
- Execution timeout/memory limits: Controlled by Judge0; backend treats status codes 5 (TLE), 7 (memory), 6 (compile error) and maps them to user-friendly messages.
- Judge system logic: Aggregates `status_id` results; counts passed tests (status_id === 3) and decides accepted vs wrong/failed. Saves metrics to Submission model.

**10. DSA & Algorithms Used**
- The codebase itself uses standard data structures provided by JavaScript/Node; specific algorithm implementations are problem-specific (stored as `referenceSolution` text). Project utilities use:
  - Arrays and mapping for testcases.
  - Basic batching, polling loops (`while(true)` in `submitToken`) — could be improved.
- Complexity considerations:
  - Polling loop uses 1s wait; worst-case latency equals judge runtime + polling delays.

**11. Important Components/Classes**
- `backend/src/controllers/usersubmission.js` — core submission flow: create DB record, prepare submissions, call Judge0, update submission.
- `backend/src/utils/codeWrapperGenerator.js` — generates language wrappers (Java, C++, JS) to convert a function signature + user code into runnable program.
- `frontend/src/pages/ProblemPage.jsx` — main editor, run/submit UI, test case rendering.

Explain major methods (examples):
- `prepareSubmissions(userCode, language, testCases, functionMetadata, languageId)` in `codeMerger.js` — merges wrapper+code per test case and returns judge submission objects.
- `submitBatch(submissions)` in `problemUtility.js` — POST to Judge0 batch endpoint.

**12. State Management**
- Global: Redux stores auth state only (`frontend/src/authSlice.js`).
- Local: Pages like `ProblemPage.jsx` use `useState` for code, selected language, run/submit results, and persist some pieces in `localStorage` keyed by `problem_<id>_<key>`.
- API state: Async thunks (`registerUser`, `loginUser`, `checkAuth`) handle loading/error states in Redux.

**13. Security Features**
- Passwords hashed with bcrypt.
- JWT verification on protected routes; logout implements token blocklist in Redis.
- CORS configured in `backend/index.js` to allow `http://localhost:5173` and credentials.
- Input validation for registration via `validator.js`.
- XSS/SQL injection: Using Mongoose reduces SQL injection risk; frontend outputs problem descriptions and code into UI—developers should sanitize or use innerText; currently raw problem description uses `whitespace-pre-wrap` but not explicit sanitization (be careful in production).

**14. Performance Optimization**
- Batch submissions to Judge0 to reduce network overhead.
- Pagination in `getAllProblem` (10 per page) to avoid large DB fetches.
- Frontend: Monaco with options to disable minimap; localStorage caching prevents repeated network calls for start code.

**15. Challenges Faced**
- Managing code execution securely: solved by delegating to Judge0.
- Ensuring reference solutions pass testcases before creating problems: implemented in `createProblem` and `updateproblem` by pre-running reference solutions against visible testcases.
- Token revocation: used Redis blocklist on logout.
- Debugging third-party API latencies: see `submitToken` polling and waiting.

**16. Future Improvements**
- Add leaderboard and contest modules.
- Move judge integration to a distributed job queue (e.g., RabbitMQ + worker pool) to scale.
- Add WebSocket-based real-time features for live contests.
- Containerize with Docker + Kubernetes for scaling judge workers.
- Add CI/CD and monitoring (Prometheus, Grafana, Sentry) and rate-limiting.

**17. Interview Questions & Answers**
- Q: Explain your project in 2 minutes.
  A: (Use the high-level workflow from Section 1.)
- Q: Biggest challenge?
  A: Managing safe code execution and guaranteeing reference solutions — addressed by Judge0 + pre-run checks.
- Q: Why this tech stack?
  A: React+Monaco for code UX, Express/Mongo for quick REST APIs, Judge0 to outsource sandboxing.
- Q: How authentication works?
  A: JWT in cookies, verified by middleware and checked against Redis blocklist.
- Q: How code execution works?
  A: Wrappers created by `codeWrapperGenerator.js`, batch submittals, poll tokens, aggregate results and save to DB.
- Q: How DB is designed?
  A: Describe models from Section 6.
- Q: How to scale?
  A: Replace blocking polling with message queue and worker pool, shard DB, add caching and CDN.
- Q: Security measures?
  A: Hash passwords, check tokens against Redis, use CORS with credentials.

**18. Resume Explanation**
- 2-line: "Built a LeetCode-style coding platform with problem creation, Monaco editor, Judge0 execution integration, JWT auth, and cloud video solutions. Implemented secure submission pipeline and admin tooling."
- 4-line: Expand to include cloudinary, Redis token blocklist, wrapper generation for multi-language support.
- ATS-friendly & HR-friendly: keep keywords (React, Node.js, Express, MongoDB, JWT, Redis, Cloudinary, Judge0).
- Technical interviewer explanation: include architecture diagram and explain `prepareSubmissions` + `submitBatch` + `submitToken` flow.

**19. System Design Perspective**
- To scale to millions:
  - Frontend: CDN for static assets.
  - Auth: Centralized token service; short-lived JWTs + refresh tokens.
  - Judge: Replace RapidAPI single-tenant Judge0 with self-hosted judge workers behind a job queue (SQS/RabbitMQ) and autoscaled workers.
  - Database: MongoDB sharding; read replicas for read-heavy endpoints.
  - Cache: Redis for frequently accessed problems and leaderboards.
  - Websockets: Use scalable pub/sub (Redis) and socket cluster for real-time contests.

**20. Deployment**
- Local run: set `.env` with `MONGO_URL`, `JWT_KEY`, `JUDGE0_KEY`, Cloudinary keys, and run backend `node index.js` and frontend with `npm run dev` (Vite).
- Production considerations: Serve frontend static build from CDN; backend behind load balancer (NGINX); environment variables stored securely; secure cookies (httpOnly, secure).

**21. Complete Request Lifecycle (example: Submit a solution)**
1. User clicks Submit in `ProblemPage.jsx` -> frontend posts to `/submission/submit/:id` using `axiosClient`.
2. Express route `/submission/submit/:id` (router `submit.js`) applies `usermiddleware` to verify token.
3. Controller `usersubmission.usersubmission` creates a `Submission` document (status: pending).
4. Controller prepares per-test-case source_code using `prepareSubmissions` (wrapper generation if applicable).
5. Controller calls `submitBatch` to send to Judge0, receives tokens.
6. Controller calls `submitToken`, polls until completion, then aggregates results.
7. Controller updates Submission doc with `status`, `runtime`, `memory`, `testCasesPassed`.
8. Controller responds to frontend with accepted flag and metrics.

**22. Important Concepts Used**
- OOP: wrapper generation assumes OO `Solution` class for Java/C++ solutions.
- DBMS: MongoDB document modeling and indexing.
- OS/Networking: Understanding of sandboxing and remote execution via Judge0, HTTP requests, polling and rate limits.
- Async programming: async/await in Node, promise-based polling in `submitToken`.

**23. Project Summary for Revision**
- Quick revision notes:
  - Files: `backend/index.js`, `backend/src/controllers/usersubmission.js`, `backend/src/utils/codeWrapperGenerator.js`, `frontend/src/pages/ProblemPage.jsx`, `frontend/src/authSlice.js`.
  - Key APIs: `/submission/run/:id`, `/submission/submit/:id`, `/problem/problemById/:id`, `/user/login`, `/user/register`.
  - Keywords: Judge0, wrapper generation, JWT cookie, Redis blocklist, Cloudinary upload signature.

**24. Diagrams (Markdown)**
- Architecture (simple):

```
Browser (React + Monaco)
  ↕ HTTPS (cookies)
Express API (auth middleware)
  ↕ Mongoose
MongoDB
  ↕ Cloudinary (video)
  ↕ Judge0 (execution)
Redis (token blocklist)
```

- Authentication flow:

```
User submits credentials -> /user/login -> backend validates -> jwt signed -> cookie set -> subsequent requests include cookie -> middleware verifies JWT -> checks Redis blocklist -> allow/deny
```

- Request lifecycle diagram (Submit):

```
Frontend Submit -> /submission/submit/:id -> usermiddleware -> usersubmission controller -> create Submission record -> prepareSubmissions -> submitBatch -> submitToken (poll) -> update Submission -> respond
```

---

Notes & Known Limitations / TODOs discovered while analyzing code:
- Leaderboard/contest/discussion features: Not implemented.
- Some minor bugs / improvements:
  - `profiledelete` in `userauthent.js` calls `submissions.deleteMany({userid})` — wrong field name; should be `{ userId: userid }`.
  - Polling `submitToken` uses a busy `while(true)` with `waiting(1000)` that returns via `setTimeout` incorrectly (the `waiting` function never returns a resolved promise). Consider replacing with `await new Promise(r => setTimeout(r, 1000))`.
  - Error handling should consistently log and return structured JSON.

If you want, I can:
- Expand the interview Q&A into a full list of 30+ Q&A items.
- Generate a slide-ready short deck from this guide.
- Create a short cheatsheet with commands to run the app locally.
