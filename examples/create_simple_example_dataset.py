#!/usr/bin/env python3
"""
Create a simple example dataset for APLOSE testing

This script generates:
1. Synthetic WAV audio files with whale-like calls
2. NetCDF spectrograms from those WAV files
"""

import numpy as np
import argparse
from pathlib import Path
from datetime import datetime, timedelta
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    import soundfile as sf
except ImportError:
    logger.error("soundfile required. Install with: pip install soundfile")
    exit(1)

try:
    from backend.utils.spectrogram import SpectrogramGenerator
except ImportError:
    logger.error("Could not import backend.utils.spectrogram")
    logger.info("Make sure you're running from the APLOSE root directory")
    exit(1)


def generate_synthetic_audio(
    duration: float = 10.0,
    sample_rate: int = 48000,
    add_whale_calls: bool = True
) -> np.ndarray:
    """
    Generate synthetic audio with optional whale-like calls

    Args:
        duration: Duration in seconds
        sample_rate: Sample rate in Hz
        add_whale_calls: Whether to add synthetic calls

    Returns:
        Audio samples as numpy array
    """
    n_samples = int(duration * sample_rate)

    # Generate pink noise background
    audio = np.random.randn(n_samples)

    # Pink noise filtering (1/f spectrum)
    freqs = np.fft.rfftfreq(n_samples, 1/sample_rate)
    spectrum = np.fft.rfft(audio)
    spectrum = spectrum / (1 + (freqs / 1000))  # Attenuate high frequencies
    audio = np.fft.irfft(spectrum, n=n_samples)

    # Normalize noise
    audio = audio / np.max(np.abs(audio)) * 0.1

    if add_whale_calls:
        t = np.arange(n_samples) / sample_rate

        # Add low-frequency upsweep (fin whale-like)
        call1_start = duration * 0.2
        call1_end = duration * 0.4
        call1_mask = (t >= call1_start) & (t <= call1_end)
        call1_t = t[call1_mask] - call1_start
        f1 = 20 + (call1_t / (call1_end - call1_start)) * 60  # 20-80 Hz sweep
        call1 = 0.3 * np.sin(2 * np.pi * np.cumsum(f1) / sample_rate)
        audio[call1_mask] += call1

        # Add mid-frequency downsweep
        call2_start = duration * 0.5
        call2_end = duration * 0.7
        call2_mask = (t >= call2_start) & (t <= call2_end)
        call2_t = t[call2_mask] - call2_start
        f2 = 3000 - (call2_t / (call2_end - call2_start)) * 1500  # 3000-1500 Hz
        call2 = 0.2 * np.sin(2 * np.pi * np.cumsum(f2) / sample_rate)
        audio[call2_mask] += call2

        # Add some clicks
        click_times = [duration * 0.15, duration * 0.85]
        for click_t in click_times:
            click_idx = int(click_t * sample_rate)
            click_width = int(0.001 * sample_rate)  # 1ms click
            if click_idx + click_width < n_samples:
                # Broadband click
                audio[click_idx:click_idx+click_width] += 0.5

    # Normalize to prevent clipping
    audio = audio / np.max(np.abs(audio)) * 0.95

    return audio.astype(np.float32)


def create_example_dataset(
    output_folder: Path,
    n_files: int = 5,
    duration: float = 10.0,
    sample_rate: int = 48000,
    interval_minutes: int = 10,
    start_datetime: datetime = None
):
    """
    Create example dataset with WAV files and spectrograms

    Args:
        output_folder: Folder to create dataset in
        n_files: Number of files to generate
        duration: Duration of each file in seconds
        sample_rate: Sample rate in Hz
        interval_minutes: Minutes between recordings
        start_datetime: Start datetime for first file
    """
    output_folder = Path(output_folder)
    output_folder.mkdir(parents=True, exist_ok=True)

    if start_datetime is None:
        start_datetime = datetime(2024, 1, 15, 8, 0, 0)

    logger.info(f"Creating example dataset in: {output_folder}")
    logger.info(f"  Files: {n_files}")
    logger.info(f"  Duration: {duration}s each")
    logger.info(f"  Sample rate: {sample_rate} Hz")
    logger.info(f"  Interval: {interval_minutes} minutes")
    logger.info(f"  Start: {start_datetime}")
    logger.info("")

    # Generate WAV files
    logger.info("Generating WAV files...")
    wav_files = []

    for i in range(n_files):
        # Calculate datetime for this file
        file_datetime = start_datetime + timedelta(minutes=i * interval_minutes)
        filename = file_datetime.strftime("%Y_%m_%d_%H_%M_%S.wav")
        wav_path = output_folder / filename

        # Generate audio
        audio = generate_synthetic_audio(
            duration=duration,
            sample_rate=sample_rate,
            add_whale_calls=True
        )

        # Save WAV file
        sf.write(str(wav_path), audio, sample_rate)
        wav_files.append(wav_path)

        logger.info(f"  ✓ {filename}")

    logger.info("")

    # Generate spectrograms with 3 different FFT sizes
    logger.info("Generating NetCDF spectrograms with multiple FFT sizes...")

    fft_configs = [
        {'nfft': 1024, 'hop_length': 256, 'name': 'FFT_1024'},
        {'nfft': 2048, 'hop_length': 512, 'name': 'FFT_2048'},
        {'nfft': 4096, 'hop_length': 1024, 'name': 'FFT_4096'},
    ]

    all_results = []
    for config in fft_configs:
        logger.info(f"  Generating with nfft={config['nfft']}, hop={config['hop_length']}...")

        generator = SpectrogramGenerator(
            nfft=config['nfft'],
            hop_length=config['hop_length'],
            window='hann',
            datetime_format='%Y_%m_%d_%H_%M_%S'
        )

        results = generator.process_folder(output_folder, output_folder, "*.wav")
        all_results.extend(results)
        logger.info(f"    ✓ Created {len(results)} spectrograms")

    logger.info("")
    logger.info("="*60)
    logger.info(f"✓ Dataset created successfully!")
    logger.info(f"  Location: {output_folder}")
    logger.info(f"  WAV files: {len(wav_files)}")
    logger.info(f"  NetCDF files: {len(all_results)} (3 FFT sizes)")
    logger.info("="*60)
    logger.info("")
    logger.info("To import into APLOSE:")
    logger.info(f"  1. Copy to Docker: cp -r {output_folder} volumes/datawork/dataset/")
    logger.info(f"  2. Import via GraphQL mutation:")
    logger.info(f"     mutation {{ importSimpleDataset(name: \"{output_folder.name}\", path: \"{output_folder.name}\") {{ ok message }} }}")
    logger.info("")


def main():
    parser = argparse.ArgumentParser(
        description="Create simple example dataset for APLOSE"
    )
    parser.add_argument(
        'output',
        type=str,
        help='Output folder for dataset'
    )
    parser.add_argument(
        '-n', '--num-files',
        type=int,
        default=5,
        help='Number of files to generate (default: 5)'
    )
    parser.add_argument(
        '-d', '--duration',
        type=float,
        default=10.0,
        help='Duration of each file in seconds (default: 10.0)'
    )
    parser.add_argument(
        '-s', '--sample-rate',
        type=int,
        default=48000,
        help='Sample rate in Hz (default: 48000)'
    )
    parser.add_argument(
        '-i', '--interval',
        type=int,
        default=10,
        help='Interval between recordings in minutes (default: 10)'
    )
    parser.add_argument(
        '--start-date',
        type=str,
        default=None,
        help='Start datetime (format: YYYY-MM-DD_HH:MM:SS, default: 2024-01-15_08:00:00)'
    )

    args = parser.parse_args()

    # Parse start date if provided
    start_datetime = None
    if args.start_date:
        try:
            start_datetime = datetime.strptime(args.start_date, '%Y-%m-%d_%H:%M:%S')
        except ValueError:
            logger.error(f"Invalid start date format: {args.start_date}")
            logger.error("Use format: YYYY-MM-DD_HH:MM:SS (e.g., 2024-01-15_08:00:00)")
            exit(1)

    create_example_dataset(
        output_folder=Path(args.output),
        n_files=args.num_files,
        duration=args.duration,
        sample_rate=args.sample_rate,
        interval_minutes=args.interval,
        start_datetime=start_datetime
    )


if __name__ == '__main__':
    main()
