# Local LLM (TGI) proxy server for Goougas Video Creator

This small Express server provides a simple HTTP API that the frontend can call to generate text with a locally hosted LLM server such as Hugging Face Text Generation Inference (TGI) or text-generation-webui.

Features
- POST /api/llm/generate — proxy a prompt to your local LLM service.
- Configurable via environment variables (LLM_URL, MODEL_NAME).

Usage
1) Install dependencies:
   cd server/llm-proxy
   npm install

2) Create a .env file (copy from .env.example) and set LLM_URL (optional) and MODEL_NAME.

3) Start the server:
   node index.js

4) Start your local TGI or text-generation-webui server (see docs/LOCAL_LLM_SETUP.md).

Notes
- This server does minimal validation and is meant for local development only. Do not expose it to the public internet without adding authentication.
