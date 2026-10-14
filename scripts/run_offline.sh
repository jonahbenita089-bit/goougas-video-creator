#!/usr/bin/env bash
set -euo pipefail

# Quick helper to create virtualenv, install deps, and run a small example.
# Usage: ./scripts/run_offline.sh "model_dir" "prompt" output.mp4

MODEL_DIR="$1"
PROMPT="$2"
OUTPUT="$3"

python -m venv .venv
source .venv/bin/activate
pip install -U pip
pip install -r offline/requirements.txt

python scripts/generate_video.py --model_dir "$MODEL_DIR" --prompt "$PROMPT" --frames 12 --fps 6 --width 640 --height 384 --output "$OUTPUT"

