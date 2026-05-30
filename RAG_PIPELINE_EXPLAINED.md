# RAG Pipeline Explained

This document explains how the interview-notes RAG feature works in this project, what gets downloaded, and what each part is responsible for.

## What the feature does

The AI Knowledge Base lets you upload PDF notes and ask questions against them.

The flow is:

1. Upload a PDF.
2. Extract text from the PDF.
3. Split the text into chunks.
4. Convert each chunk into embeddings.
5. Store the chunks and embeddings in Chroma.
6. When you ask a question, embed the question.
7. Search Chroma for the most similar chunks.
8. Send the retrieved chunks to Ollama to generate the final answer.

## Main pieces in the code

### Frontend

- [frontend/src/pages/AIKnowledgeBase.jsx](frontend/src/pages/AIKnowledgeBase.jsx) is the UI for uploading PDFs and chatting with your notes.
- [frontend/src/utils/axiosClient.js](frontend/src/utils/axiosClient.js) sends requests to the backend.

### Backend routes and controllers

- [backend/src/routes/ragRoutes.js](backend/src/routes/ragRoutes.js) defines:
  - `POST /api/rag/upload`
  - `POST /api/rag/chat`
- [backend/src/controllers/ragController.js](backend/src/controllers/ragController.js) handles upload and chat requests.

### PDF processing

- [backend/src/services/pdfService.js](backend/src/services/pdfService.js) reads the PDF, extracts text, splits it into chunks, and sends the chunks for indexing.

### Embeddings

- [backend/src/services/embeddingService.js](backend/src/services/embeddingService.js) sends text to Ollama’s embedding API.
- Default embedding model: `nomic-embed-text`

### Vector store

- [backend/src/services/vectorStoreService.js](backend/src/services/vectorStoreService.js) stores and searches chunks in Chroma.
- It uses Chroma first.
- If Chroma is unavailable, it falls back to a local JSON store at `uploads/rag-local-store.json`.

### Chat answering

- [backend/src/services/ragChatService.js](backend/src/services/ragChatService.js) does the retrieval step and then asks Ollama to generate the answer.

## What gets downloaded or installed

There are three different kinds of downloads in this setup.

### 1. Node packages

These are installed with `npm install` in `backend/` and `frontend/`.

Backend packages used by RAG:

- `axios`
- `express`
- `multer`
- `pdf-parse`
- `dotenv`

Frontend packages used by the page:

- `axios`
- `react-markdown`
- `remark-gfm`
- `framer-motion`
- `lucide-react`

### 2. Ollama models

These are downloaded by Ollama itself, not by npm.

Recommended models for this project:

- `nomic-embed-text` for embeddings
- `gemma3:4b` for chat generation

Typical commands:

```bash
ollama pull nomic-embed-text
ollama pull gemma3:4b
```

### 3. Chroma DB server

Chroma is the vector database used to store and search embeddings.

You can run it with Docker, for example:

```bash
docker run -p 8000:8000 chromadb/chroma
```

That gives you a local Chroma server at `http://localhost:8000`.

## Important environment variables

Backend RAG settings:

```env
PORT=3000
OLLAMA_API_URL=http://localhost:11434/api/chat
OLLAMA_MODEL=gemma3:4b
OLLAMA_EMBEDDING_MODEL=nomic-embed-text
CHROMA_API_URL=http://localhost:8000
CHROMA_TENANT=default_tenant
CHROMA_DATABASE=default_database
```

Other backend env vars already used elsewhere in the app:

- `MONGO_URL`
- `JWT_KEY`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## How the upload flow works

When you upload a PDF:

1. The frontend sends the file to `POST /api/rag/upload`.
2. `multer` saves the file in `uploads/`.
3. `pdf-parse` extracts text from the PDF.
4. The text is chunked into smaller pieces.
5. Each chunk is sent to Ollama embeddings.
6. The embeddings and metadata are stored in Chroma.
7. If Chroma is not reachable, the chunks are also written to the local fallback JSON store.

## How the question-answer flow works

When you ask a question:

1. The frontend sends the question to `POST /api/rag/chat`.
2. The backend embeds your question using Ollama embeddings.
3. The backend searches Chroma for the most similar chunks.
4. The retrieved chunks are placed into a prompt.
5. Ollama chat generates the final answer.
6. The backend returns:
   - `answer`
   - `sources`

## Why you saw the errors earlier

### `net::ERR_CONNECTION_RESET`

Usually means one of these:

- backend was not running
- Chroma was not reachable
- Ollama was not running
- the request hit the wrong Chroma route shape

### `405` from Chroma

This happened because the backend was trying a route shape that did not match the Chroma v2 server you installed.

The vector store code was updated to resolve the collection correctly and use the live v2 API paths.

### React child error

The UI tried to render an object directly instead of text.

That was fixed by converting sources like `{ filename, chunkIndex }` into readable strings before rendering.

## How to verify the setup

1. Start Ollama.
2. Pull the models.
3. Start Chroma.
4. Start the backend.
5. Open the frontend.
6. Upload a PDF.
7. Ask a question about the PDF.

Useful commands:

```bash
cd backend
node index.js
```

```bash
cd frontend
npm run dev
```

## What is stored locally

Even when Chroma is running, the project also keeps a local fallback store at:

- `backend/uploads/rag-local-store.json`

This file stores:

- chunk text
- metadata like filename and chunk index
- embeddings

It is used only as a fallback if remote Chroma is down.

## Quick mental model

Think of the system as two stages:

- Indexing stage: PDF -> chunks -> embeddings -> Chroma
- Question stage: question -> embedding -> search Chroma -> answer from Ollama

If you want, you can now read just this one file whenever you need a full picture of the RAG setup.