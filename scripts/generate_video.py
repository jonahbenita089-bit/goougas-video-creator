#!/usr/bin/env python3
"""Generate a short video offline by creating a sequence of images using a local Stable Diffusion model
and assembling them into an MP4 using ffmpeg.

This script uses the diffusers StableDiffusionPipeline and requires a local model directory (--model_dir).
"""
import argparse
import os
import subprocess
from pathlib import Path
import torch
from tqdm import trange
from PIL import Image

try:
    from diffusers import StableDiffusionPipeline
except Exception as e:
    print("diffusers not found. Please install requirements: pip install -r offline/requirements.txt")
    raise


def ensure_dir(p: Path):
    p.mkdir(parents=True, exist_ok=True)


def generate_frames(model_dir, prompt, width, height, frames, device, seed, out_dir):
    # Load pipeline from local folder
    pipe = StableDiffusionPipeline.from_pretrained(model_dir, torch_dtype=torch.float16 if device.startswith('cuda') else torch.float32)
    pipe = pipe.to(device)

    generator = torch.Generator(device=device)
    base_seed = seed

    for i in trange(frames, desc="Generating frames"):
        generator.manual_seed(base_seed + i)
        img = pipe(prompt, height=height, width=width, generator=generator).images[0]
        img_path = out_dir / f"frame_{i:04d}.png"
        img.save(img_path)

    # Cleanup
    pipe.to('cpu')
    del pipe


def assemble_video(frames_dir, fps, output_path, crf=18):
    # Use ffmpeg to assemble PNG sequence into MP4
    # -crf controls quality (lower better). Requires ffmpeg in PATH.
    cmd = [
        "ffmpeg",
        "-y",
        "-framerate",
        str(fps),
        "-i",
        str(frames_dir / "frame_%04d.png"),
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-crf",
        str(crf),
        str(output_path),
    ]
    print("Running:", " ".join(cmd))
    subprocess.check_call(cmd)


def main():
    parser = argparse.ArgumentParser(description="Generate a short video offline using a local Stable Diffusion model and ffmpeg")
    parser.add_argument('--model_dir', required=True, help='Path to local diffusers model directory')
    parser.add_argument('--prompt', required=True, help='Text prompt for image generation')
    parser.add_argument('--width', type=int, default=512)
    parser.add_argument('--height', type=int, default=512)
    parser.add_argument('--frames', type=int, default=8)
    parser.add_argument('--fps', type=int, default=4)
    parser.add_argument('--output', required=True, help='Output MP4 path')
    parser.add_argument('--seed', type=int, default=42)
    parser.add_argument('--device', default='cuda' if torch.cuda.is_available() else 'cpu')
    parser.add_argument('--keep_frames', action='store_true', help='Do not delete frames after assembling')
    args = parser.parse_args()

    output_path = Path(args.output)
    frames_dir = output_path.parent / 'frames_temp'
    ensure_dir(frames_dir)

    print(f"Using device: {args.device}")
    generate_frames(args.model_dir, args.prompt, args.width, args.height, args.frames, args.device, args.seed, frames_dir)

    assemble_video(frames_dir, args.fps, output_path)

    if not args.keep_frames:
        # Optionally delete frames
        for f in frames_dir.glob('frame_*.png'):
            f.unlink()
        try:
            frames_dir.rmdir()
        except OSError:
            pass

    print(f"Done. Video saved to {output_path}")


if __name__ == '__main__':
    main()
