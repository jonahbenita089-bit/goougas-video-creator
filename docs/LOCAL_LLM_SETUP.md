Local LLM setup (Text Generation Inference or text-generation-webui)

This document explains how to run a local LLM server for offline usage with Goougas Video Creator. The recommended path (for best quality and GPU performance) is to run Hugging Face's Text Generation Inference (TGI) server. If you prefer a quick CPU-friendly route, see the text-generation-webui or ggml/llama.cpp options.

A) Recommended: Hugging Face Text Generation Inference (TGI)
Prerequisites: NVIDIA GPU with CUDA drivers and >= 8GB VRAM (16+GB recommended for larger models)

1) Pull the official docker image

```bash
docker pull ghcr.io/huggingface/text-generation-inference:latest
```

2) Run with a model mounted (example using a model ID available on Hugging Face)

```bash
docker run --gpus all -p 8080:8080 -v /path/to/models:/models ghcr.io/huggingface/text-generation-inference:latest --model-id /models/my-model
```

Or if you want to pull by name (internet required for initial download):

```bash
docker run --gpus all -p 8080:8080 ghcr.io/huggingface/text-generation-inference:latest --model-id facebook/opt-1.3b
```

3) Confirm the server is up:

```bash
curl -X POST "http://localhost:8080/v1/models/<model>/generate" -H "Content-Type: application/json" -d '{"inputs":"Hello world"}'
```

B) Alternative: text-generation-webui
- Follow text-generation-webui repo: https://github.com/oobabooga/text-generation-webui
- This provides a web UI and an HTTP API adapter. Works with many model formats (ggml, transformers).

C) CPU / Lightweight (ggml / llama.cpp)
- Use ggml/llama.cpp-based models with a local server like ollama or tinygrad-backed webui. These are CPU-friendly but lower quality and slower.

Connecting to Goougas
- Configure server/llm-proxy/.env with LLM_URL or MODEL_NAME. If you use the default TGI port 8080 and a model name `my-model`, you can leave LLM_URL blank and set MODEL_NAME=my-model.
- Start the LLM service, then start the proxy (node server/llm-proxy/index.js).
- The frontend chat widget will call the proxy at /api/llm/generate.

Security
- This setup is for local, offline usage. Do NOT expose the proxy or the LLM server to the public internet without adding auth and rate limiting.
