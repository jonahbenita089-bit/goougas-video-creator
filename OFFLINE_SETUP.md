# Goougas Video Creator — Offline Video Generation

This folder contains tools and instructions to generate short videos offline using a local Stable Diffusion text→image model and ffmpeg to assemble frames into an MP4.

Summary
- Generates a sequence of images from a text prompt using a local Stable Diffusion model (diffusers-compatible directory).
- Assembles the images into an MP4 using ffmpeg.
- Optional: generate a voice-over audio track using Coqui TTS and mux it into the final MP4.

Prerequisites (recommended hardware/software)
- Linux/macOS/Windows with Python 3.9+ (3.10 recommended).
- A CUDA-capable GPU (NVIDIA) with at least 8GB VRAM for reasonable speed. CPU-only is supported but very slow for many frames.
- ffmpeg installed and in PATH.
- Model files downloaded locally (see below).

Models
1) Stable Diffusion (1.5 / SDXL / SDXL-refiner)
- Download a diffusers-compatible model to a local folder, e.g. models/stable-diffusion-1-5/ or models/sdxl/.
- Place the model files where you like and pass --model_dir when running the script. The script uses diffusers' StableDiffusionPipeline and expects either:
  - A folder prepared by `diffusers` (with `model_index.json` and `unet`, `vae`, `text_encoder`), or
  - A converted checkpoint. See diffusers docs for conversion steps.

2) (Optional) Coqui TTS model
- To generate offline speech, install Coqui TTS and download a TTS model locally. Pass --tts to enable audio generation.

Quick setup
1) Create and activate a venv:

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -U pip
pip install -r offline/requirements.txt
```

2) Ensure ffmpeg is installed (apt, brew, choco, or official builds).

3) Download a Stable Diffusion model and place it in models/stable-diffusion-1-5 (or another folder).

Run an example

```bash
# Generate a short 4-second video (16 frames at 4 fps) and output video.mp4
python scripts/generate_video.py \
  --model_dir models/stable-diffusion-1-5 \
  --prompt "A cinematic scene of a city at sunset, realistic, 35mm camera" \
  --width 768 --height 512 \
  --frames 16 --fps 4 \
  --output output/video.mp4
```

Notes & tips
- For smoother motion, increase --frames and FPS. Consider using frame interpolation tools (e.g., RIFE, DAIN) after generation to smooth motion.
- Use GPU with CUDA and install the appropriate torch+cu version from https://pytorch.org.
- If you want controllable camera motion, generate variations of prompt/camera tokens or experiment with latent interpolation (future enhancement).
