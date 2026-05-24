# Enterprise RAG Frontend

A document chat interface built with Next.js and TypeScript. Upload a PDF, create a conversation, and ask questions while viewing the document alongside streamed answers. When conversation history includes source snippets, citation controls search for the corresponding text in the PDF.

This repository contains the frontend. Document storage, retrieval, AI inference, and conversation persistence require a separate backend implementing the API described below.

## Contents

- [Features and stack](#features-and-stack)
- [Local setup](#local-setup)
- [Configuration](#configuration)
- [Using the app](#using-the-app)
- [Commands](#commands)
- [Project structure](#project-structure)
- [Backend API contract](#backend-api-contract)
- [Development and verification](#development-and-verification)
- [Production and Docker](#production-and-docker)
- [Troubleshooting](#troubleshooting)
- [Current limitations](#current-limitations)

## Features and stack

- Create document sessions through a file upload.
- List, reopen, and delete sessions.
- Display a PDF beside its conversation.
- Stream answers and render Markdown responses.
- Load conversation history and highlight source snippets supplied by the backend.
- Switch between light, dark, and system themes.
- Explore a separate, two-step form demo at `/learn`.

| Area                 | Implementation                                            |
| -------------------- | --------------------------------------------------------- |
| Framework            | Next.js 16 App Router, React 19, TypeScript 5             |
| UI and styling       | Material UI 7, Emotion, CSS Modules, Tailwind CSS 4       |
| State                | Redux Toolkit and React Redux                             |
| Networking           | Axios for session requests; native Fetch streams for chat |
| PDF display          | React PDF Viewer with a PDF.js 3.11.174 worker            |
| Answer rendering     | React Markdown                                            |
| Demo form validation | Zod                                                       |
| Developer tooling    | ESLint, Prettier, Husky, lint-staged                      |

Use `package.json` for dependency ranges and `package-lock.json` for the resolved dependency tree.

## Local setup

### Prerequisites

- Node.js 24 to match the repository's Docker base image.
- npm and Git.
- A running backend that implements the endpoints below.

The installed Next.js package requires Node.js 20.9 or later; the installed lint-staged package requires 20.17 or later. Node.js 24 aligns local development with Docker.

### Install and start

From the repository root:

```bash
npm ci
```

Create `.env.local` with the following content, replacing the example address with your backend's actual base URL:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Port `8000` is an example, not a backend supplied or configured by this repository. The existing `.env.example` lists the variable name but does not provide a value.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The UI can start independently, but uploads, sessions, and chat need the backend.

## Configuration

| Variable              | Required                            | Purpose                                                                  |
| --------------------- | ----------------------------------- | ------------------------------------------------------------------------ |
| `NEXT_PUBLIC_API_URL` | Yes, for document and chat features | Browser-accessible backend base URL, for example `http://localhost:8000` |

Use a base URL without a trailing slash. If your backend uses a prefix such as `/api`, include it in this value. Both `app/util/api.ts` and `app/util/apiClient.ts` read this variable.

- Restart the development server after changing environment configuration.
- Set this value before a production build: public environment values are embedded in the browser bundle. Rebuild when changing the backend URL.
- This is public configuration; do not put API keys or other secrets in it.
- For separate frontend and backend origins, the backend must allow the frontend origin through CORS, including document downloads and chat requests.
- Use a browser-reachable HTTPS backend when serving the frontend over HTTPS.

Environment files are ignored by `.gitignore`.

## Using the app

1. Open `/chat`, or select **start** on the home page.
2. Select **Create New Session**, choose a PDF, and select **Upload and Analyze**.
3. After the backend creates the session, the app opens `/chat/<session-id>`.
4. Wait for the document to load, then submit a question. The answer appears as text arrives from the backend.
5. Reopen a session from `/chat` to load its history. If history includes `sources`, select a citation icon to search for that snippet in the PDF.
6. Delete a session from the session list and confirm the deletion when prompted.

Sample PDFs are available in `public/sample.pdf` and `public/sample-policy.pdf` for manual testing.

| Route        | Purpose                                                                                        |
| ------------ | ---------------------------------------------------------------------------------------------- |
| `/`          | Landing page with links to chat and the form demo                                              |
| `/chat`      | Session list, document upload, and session deletion                                            |
| `/chat/[id]` | PDF viewer and conversation for one session                                                    |
| `/learn`     | Identity/security form demo with Zod validation; submissions are logged to the browser console |

## Commands

| Command           | Purpose                                                            |
| ----------------- | ------------------------------------------------------------------ |
| `npm ci`          | Install dependencies from the lockfile; also runs the prepare hook |
| `npm run dev`     | Start the development server                                       |
| `npm run build`   | Create the production build                                        |
| `npm start`       | Serve an existing production build                                 |
| `npm run lint`    | Run ESLint                                                         |
| `npm run format`  | Rewrite formatting across the repository with Prettier             |
| `npm run prepare` | Initialize Husky Git hooks                                         |

For a different development port, use `npm run dev -- --port 3001`.

## Project structure

```text
app/
  page.tsx                    Landing page
  layout.tsx                  Root layout, fonts, navbar, and providers
  providers.tsx               Redux and Material UI providers
  StoreProvider.tsx           Store lifecycle
  emotion-registry.tsx        Emotion style registry
  globals.css                 Global styles
  chat/
    page.tsx                  Session list and upload workflow
    [id]/page.tsx             Document and conversation view
    _components/              Chat input, messages, sessions, upload modal
  components/                 Navbar and PDF viewer components
  lib/
    store.ts                  Redux store configuration
    hooks.ts                  Typed Redux hooks
    features/Sessions/        Session state, selectors, and async requests
    features/counter/         Counter example state
    features/posts/           Posts example state
  types/                      Session, chat, document, and post types
  util/                       API configuration, errors, and theme
  learn/                      Standalone form demo
public/                       Static assets and sample PDFs
.husky/pre-commit              Staged-file formatting hook
dockerfile                    Dependency installation and build stages
```

The main data flow is page/component → Redux async thunk → backend → session slice → UI. Chat requests use Fetch directly so response chunks can update the in-progress answer. The PDF viewer is dynamically imported with server-side rendering disabled.

## Backend API contract

This contract reflects requests and types used by the frontend; it is not a complete backend specification. All paths are relative to `NEXT_PUBLIC_API_URL`.

| Method   | Path                        | Request                                                     | Expected response                                                   |
| -------- | --------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------- |
| `POST`   | `/session`                  | Multipart form with `file`                                  | Session object containing an `id` used for navigation               |
| `GET`    | `/session`                  | None                                                        | Array of session objects                                            |
| `GET`    | `/session/{session_id}`     | None                                                        | Object containing `document_id`                                     |
| `DELETE` | `/session/{session_id}`     | None                                                        | Successful response; body is not used to remove the session locally |
| `GET`    | `/history/{session_id}`     | None                                                        | Array of chat history objects                                       |
| `POST`   | `/chat`                     | Multipart form with `question`, `file_id`, and `session_id` | Streamed UTF-8 answer text                                          |
| `GET`    | `/files/{file_id}/download` | None                                                        | PDF bytes readable by the browser viewer                            |

### Session shape

```json
{
  "id": "session-123",
  "document_id": "document-456",
  "title": "Policy questions",
  "created_at": "2026-01-01T12:00:00Z"
}
```

The frontend uses the session's `document_id` as `file_id` when downloading the PDF and sending questions.

### History item shape

```json
{
  "id": "message-789",
  "question": "What does the policy cover?",
  "answer": "The policy covers **eligible expenses**.",
  "sources": ["Eligible expenses include travel and accommodation."],
  "created_at": "2026-01-01T12:01:00Z",
  "document_id": "document-456",
  "file_id": "document-456",
  "document": {
    "id": "document-456",
    "filename": "policy.pdf",
    "created_at": "2026-01-01T12:00:00Z"
  }
}
```

These shapes correspond to `app/types/Session.type.ts`, `app/types/chat.type.ts`, and `app/types/document.type.ts`.

### Streaming and networking behavior

`POST /chat` is consumed as raw text chunks. The client does not parse JSON, newline-delimited JSON, or Server-Sent Events framing. The backend should stream answer text directly, and any reverse proxy should allow incremental delivery instead of buffering the whole response.

The completed local message contains an ID, question, and answer. It does not receive source metadata from the stream; citation controls depend on `sources` supplied in loaded history.

Axios session/history requests have a 10-second timeout. Chat uses a separate Fetch request without that Axios timeout. Authentication interceptors in `apiClient.ts` are commented out; the client does not currently attach an authorization token.

## Development and verification

Before submitting application changes, run:

```bash
npm run lint
npm run build
```

The pre-commit hook runs `lint-staged`, which formats supported staged files with Prettier. It does not run lint or a production build. There is currently no automated test script configured in `package.json`.

For a manual integration check with the backend running:

1. Upload one of the sample PDFs and verify navigation to the new session.
2. Confirm the PDF renders and a question produces an incremental answer.
3. Reload the session and verify persisted history loads.
4. Test a citation when history contains source text that exists in the PDF.
5. Change the theme, return to the session list, and verify session deletion.

## Production and Docker

Set `NEXT_PUBLIC_API_URL` for the target environment, then run:

```bash
npm ci
npm run build
npm start
```

The root layout uses `next/font/google` for Geist fonts, so the build environment needs access to fetch those fonts. At runtime, the PDF viewer loads its PDF.js worker from `unpkg.com`; network and content security policy settings must allow that worker resource.

The repository's lowercase `dockerfile` uses `node:24-alpine` and contains dependency and build stages only. It has no application start command or dedicated runtime stage, and the repository has no `.dockerignore`. A runnable deployment image needs those pieces added and the public API URL available during the build. The current Dockerfile should be treated as build scaffolding.

## Troubleshooting

| Symptom                                             | Checks                                                                                                                                                   |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Session list or uploads fail                        | Verify `NEXT_PUBLIC_API_URL`, backend availability, browser Network responses, and backend CORS settings. Restart development after environment changes. |
| Requests target the frontend or contain `undefined` | Check that `.env.local` contains a complete `NEXT_PUBLIC_API_URL=...` assignment.                                                                        |
| Session requests time out                           | Check whether the backend needs more than the Axios client's 10-second timeout, especially during document processing.                                   |
| PDF does not render                                 | Verify the session returns a valid `document_id`, the download endpoint returns PDF bytes, and the browser can load the worker from `unpkg.com`.         |
| Answer arrives all at once                          | Check that the backend streams raw text and the reverse proxy is not buffering it.                                                                       |
| Answer includes protocol text such as `data:`       | The backend is returning framed events; the current client expects raw answer text.                                                                      |
| Citation icons are absent                           | Check whether loaded history contains a nonempty `sources` array. Fresh streamed answers do not include sources.                                         |
| Citation does not highlight text                    | The snippet must match searchable PDF text; scanned PDFs may lack a text layer. The viewer searches a shortened snippet.                                 |
| Production still uses an old backend URL            | Rebuild with the new public API URL; changing only the runtime environment is insufficient.                                                              |
| Build fails while fetching fonts                    | Check build-time access to Google Fonts used by `app/layout.tsx`.                                                                                        |

## Current limitations

- The upload control suggests PDF files but does not enforce file type or size. Backend validation is required.
- Authentication is not implemented, and the navbar's user name is placeholder text.
- `/learn` is a local form demonstration, not a registration flow. Successful submissions, including the password field, are logged to the console; use dummy values only.
- Chat streaming does not currently check HTTP status before consuming the response body or parse structured error events.
- Backend setup, model configuration, database migrations, and deployment infrastructure are outside this repository.
