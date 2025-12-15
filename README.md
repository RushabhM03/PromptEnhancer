# Deep Prompt Generator

A full‑stack **prompt engineering workspace** that lets you:

- Define **deep parameters** for an LLM (use case, role, tone, safety, constraints, etc.).
- Generate a structured **system + user prompt**.
- Optionally **refine** that prompt using a **free Hugging Face model** via the OpenAI‑compatible router (e.g. `nvidia/Nemotron-Orchestrator-8B`).

Tech stack:

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **LLM**: Hugging Face Inference Router (OpenAI‑compatible API)

---

## Features

### Frontend

- “Prompt Parameters” form:
  - Use case title, audience, AI role, detailed description.
  - Tone, language, depth level, reasoning style, output format.
  - Max token hint and “Allow tools” toggle.
  - **Advanced constraints** section:
    - Avoid topics
    - Must include
    - Forbidden phrases
- “Generated Prompt” preview:
  - Shows **system prompt**, **user prompt**, optional **tool instructions** and notes.
  - Button to **Refine with HF LLM**.

### Backend

- `POST /api/prompt/generate`  
  Accepts `PromptParameters` and returns:
  
  ```
  {
  systemPrompt: string;
  userPrompt: string;
  toolInstructions?: string;
  notes?: string;
  }
  ```


- `POST /api/prompt/refine`  
Sends the generated prompt to Hugging Face router (`/v1/chat/completions`) via the OpenAI JS client and returns a refined:

  ```
  {
  systemPrompt: string;
  userPrompt: string;
  }
  ```

---

## Prerequisites

- **Node.js**: v20.19+ or v22+  
- **npm** (or pnpm / yarn)  
- **Git**  
- **Hugging Face** account + access token (read scope)

---

## Backend Setup


```
cd backend
npm install
```

Create `backend/.env`:

```
PORT=4000

HF router OpenAI-compatible token
HF_TOKEN=hf_your_token_here

Model used for refinement
HF_MODEL=nvidia/Nemotron-Orchestrator-8B

e.g. HF_MODEL=Qwen/Qwen3-4B-Instruct-2507:nscale
NODE_ENV=development
```

Start backend in dev:

```
npm run dev
```

---

## Frontend Setup

```
cd frontend
npm install
npm run dev
```

