#!/usr/bin/env python3
"""
Remove WAV files shorter than a minimum duration from an APLOSE dataset folder,
along with their associated spectrogram PNGs, JSON metadata, and NetCDF files.

Usage:
    python clean_short_files.py <dataset_folder> [--min-duration 30] [--dry-run]
"""

import argparse
import wave
import glob
import os
import sys


def get_wav_duration(wav_path: str) -> float:
    """Return duration in seconds of a WAV file."""
    with wave.open(wav_path, "rb") as f:
        frames = f.getnframes()
        rate = f.getframerate()
        return frames / float(rate)


def find_associated_files(wav_path: str) -> list[str]:
    """Return all spectrogram PNGs, JSONs, and NetCDF files linked to a WAV file."""
    stem = os.path.splitext(wav_path)[0]
    associated = []

    # NetCDF: same stem, .nc extension
    nc = stem + ".nc"
    if os.path.exists(nc):
        associated.append(nc)

    # Data PNG + JSON: stem_fft{N}_data.png / .json (one or more FFT sizes)
    for png in glob.glob(stem + "_fft*_data.png"):
        associated.append(png)
    for json_file in glob.glob(stem + "_fft*_data.json"):
        associated.append(json_file)

    return associated


def clean_dataset(folder: str, min_duration: float, dry_run: bool) -> None:
    wav_files = sorted(glob.glob(os.path.join(folder, "**", "*.wav"), recursive=True))

    if not wav_files:
        print(f"No WAV files found in {folder}")
        return

    removed_count = 0
    removed_bytes = 0

    for wav_path in wav_files:
        try:
            duration = get_wav_duration(wav_path)
        except Exception as e:
            print(f"[WARN] Could not read {wav_path}: {e}")
            continue

        if duration >= min_duration:
            continue

        associated = find_associated_files(wav_path)
        all_files = [wav_path] + associated

        print(f"\n[{'DRY RUN' if dry_run else 'DELETE'}] {os.path.basename(wav_path)} ({duration:.1f}s)")
        for f in all_files:
            size = os.path.getsize(f)
            print(f"  - {os.path.basename(f)}  ({size / 1024:.1f} KB)")
            if not dry_run:
                os.remove(f)
            removed_count += 1
            removed_bytes += size

    print(f"\n{'Would remove' if dry_run else 'Removed'} {removed_count} file(s) "
          f"({removed_bytes / 1024 / 1024:.2f} MB)")


def main():
    parser = argparse.ArgumentParser(description="Remove short WAV files and their spectrograms from an APLOSE dataset.")
    parser.add_argument("folder", help="Path to the APLOSE dataset folder")
    parser.add_argument("--min-duration", type=float, default=30.0,
                        help="Minimum duration in seconds (default: 30)")
    parser.add_argument("--dry-run", action="store_true",
                        help="Preview deletions without removing anything")
    args = parser.parse_args()

    if not os.path.isdir(args.folder):
        print(f"Error: '{args.folder}' is not a directory.", file=sys.stderr)
        sys.exit(1)

    print(f"Dataset folder : {args.folder}")
    print(f"Min duration   : {args.min_duration}s")
    print(f"Mode           : {'DRY RUN' if args.dry_run else 'LIVE DELETE'}\n")

    clean_dataset(args.folder, args.min_duration, args.dry_run)


if __name__ == "__main__":
    main()
