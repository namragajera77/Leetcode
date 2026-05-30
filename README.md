# AI-Based Coding Interview Preparation Platform
AI-Based Coding Interview Preparation Platform is a full-stack interview practice system for solving coding problems, reviewing solutions with AI, and preparing from uploaded study materials. It combines a React + Vite frontend, an Express + MongoDB backend, and local AI services through Ollama.

## Overview

- LeetCode-style coding problems with Monaco editor, Judge0 execution, and submission history
- AI code review with structured feedback, interview score, strengths, and improvements
- AI hint generator for guided problem solving
- AI Knowledge Base for uploading interview prep PDFs and chatting with notes using RAG
- Admin tools for problem creation, updates, deletion, and editorial video management
- DSA visualization link integrated into the logged-in dashboard

## Tech Stack

- Frontend: React 19, Vite, Redux Toolkit, React Router, Monaco Editor, Tailwind CSS, DaisyUI, Framer Motion
- Backend: Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt, Multer, CORS
- AI: Ollama for chat and embeddings, ChromaDB compatibility with local fallback storage
- Utilities: Axios, React Hook Form, Zod, React Markdown, Lucide icons

## Core Features

### Coding Platform
- Problem browsing and filtering by difficulty, topic, and status
- Multi-language editor support
- Auto-saved code per language and problem
- Judge0 execution for run and submit flows
- Submission history and user progress tracking

### AI Tools
- AI Code Reviewer with logic analysis, bugs, complexity, optimizations, edge cases, strengths, improvements, and interview readiness score
- AI Hint Generator for progressive, non-spoiler help
- AI Coding Assistant chat for problem-solving questions

### AI Knowledge Base
- Upload interview prep PDFs and notes
- Chunking and embeddings using Ollama `nomic-embed-text`
- Retrieval-augmented generation for asking questions from uploaded material
- Source references for retrieved answers
- Upload interview prep PDFs and notes
- Chunking and embeddings using Ollama `nomic-embed-text`
- Retrieval-augmented generation for asking questions from uploaded material
- Source references for retrieved answers
- Local fallback storage when vector DB is unavailable

### Admin & Media
- Admin-only problem management
- Editorial video upload and management
- Secure role-based access control

Routes
------
- `/` - landing page or homepage depending on auth state
- `/login` - sign in
- `/signup` - create account
- `/about` - platform overview
- `/contact` - contact page
- `/profile` - user progress and stats
- `/problem/:problemId` - coding problem editor
- `/ai-knowledge-base` - RAG notes assistant for logged-in users only

Environment Variables
---------------------
Set these in `backend/.env`.

- `MONGO_URL` - MongoDB connection string
- `JWT_KEY` - JWT secret
- `PORT` - backend port
- `OLLAMA_API_URL` - Ollama base URL, for example `http://localhost:11434`
- `OLLAMA_MODEL` - default chat model
- `OLLAMA_CHAT_MODEL` - optional chat model override
- `OLLAMA_EMBEDDING_MODEL` - embedding model, for example `nomic-embed-text`
- `CHROMA_API_URL` - ChromaDB server URL if you want remote vector storage
- `CLOUDINARY_*` - only if using cloud uploads for editorial videos

Local Setup
-----------
### 1. Backend
```powershell
cd backend
npm install
npm run dev
```

### 2. Frontend
```powershell
cd frontend
npm install
npm run dev
```

### 3. Ollama models
```powershell
ollama pull gemma3:4b
ollama pull nomic-embed-text
```

### 4. Optional ChromaDB
If you want remote vector storage, run Chroma and set `CHROMA_API_URL`. If Chroma is unavailable, the app falls back to local storage in `backend/uploads/rag-local-store.json`.

RAG Flow
--------
1. Upload a PDF in AI Knowledge Base
2. Extract text from the PDF
3. Chunk the text into overlapping passages
4. Create embeddings with Ollama
5. Store chunks in ChromaDB or local fallback storage
6. Embed the question and retrieve relevant chunks
7. Build context and ask Ollama for an answer
8. Return answer plus source document references

Project Structure
-----------------
```text
backend/
├── index.js
└── src/
  ├── config/
  ├── controllers/
  ├── middleware/
  ├── models/
  ├── routers/
  └── services/

frontend/
├── index.html
└── src/
  ├── App.jsx
  ├── authSlice.js
  ├── components/
  ├── pages/
  ├── store/
  └── utils/
```

Useful Files
------------
- `backend/src/controllers/ragController.js`
- `backend/src/services/pdfService.js`
- `backend/src/services/embeddingService.js`
- `backend/src/services/vectorStoreService.js`
- `backend/src/services/ragChatService.js`
- `frontend/src/pages/AIKnowledgeBase.jsx`
- `frontend/src/pages/ProblemPage.jsx`
- `frontend/src/pages/Homepage.jsx`

Notes
-----
- The AI Knowledge Base route is restricted to logged-in users.
- The backend is designed to keep working even if ChromaDB is unavailable.
- If you re-upload a PDF after changing the RAG pipeline, it will be indexed with the latest flow.

License
-------
Internal/student project use unless a separate license is added.
