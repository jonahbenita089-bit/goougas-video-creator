# Video generation API for Goougas Video Creator

This service supports both offline local generation and online/cloud generation. It exposes a single API used by the frontend.

Endpoints
- POST /api/generate/video
- GET /api/generate/video/:jobId
- GET /api/video/download/:jobId
- GET /health

Quick start
1) Install dependencies:

```bash
cd server/video-proxy
cp .env.example .env
npm install
```

2) For offline mode, download a local Stable Diffusion model and point `LOCAL_MODEL_DIR` at it.

3) Start the service:

```bash
npm start
```

Request example (offline)

```bash
curl -X POST http://localhost:5174/api/generate/video \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A cinematic city at sunset, realistic, ultra detailed",
    "mode": "offline",
    "width": 768,
    "height": 512,
    "frames": 12,
    "fps": 4
  }'
```

Request example (online)

```bash
curl -X POST http://localhost:5174/api/generate/video \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A cinematic city at sunset, realistic, ultra detailed",
    "mode": "online",
    "provider": "hf",
    "model": "google/flan-t5-small"
  }'
```

Notes
- For offline generation, the server invokes the repo's `scripts/generate_video.py` script and saves the final MP4 into `output/`.
- For online mode, provider adapters require API keys and provider-specific model IDs. Use a supported model with signed credentials.
- This is intended for private/local use. Do not expose it publicly without auth and rate limiting.
