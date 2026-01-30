#!/usr/bin/env python3
"""
Command-line interface for APLOSE Audio Processor.
"""

import argparse
import sys
from pathlib import Path
from .generator import AploseAudioProcessor


def parse_fft_sizes(fft_str: str) -> list:
    """Parse comma-separated FFT sizes."""
    try:
        return [int(x.strip()) for x in fft_str.split(',')]
    except ValueError:
        raise argparse.ArgumentTypeError(
            f"FFT sizes must be comma-separated integers, got: {fft_str}"
        )


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(
        description='Generate APLOSE-compatible NetCDF files from audio files.',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Process folder with default settings
  python -m aplose_audio_processor.cli -i audio_files/ -o output/

  # Resample to 48kHz and create 60-second snippets
  python -m aplose_audio_processor.cli -i audio_files/ -o output/ \\
    --sample-rate 48000 --snippet-duration 60

  # Multi-FFT with 3 different FFT sizes
  python -m aplose_audio_processor.cli -i audio_files/ -o output/ \\
    --fft-sizes 1024,2048,4096

  # Create 1-minute snippets with 10-second overlap
  python -m aplose_audio_processor.cli -i audio_files/ -o output/ \\
    --snippet-duration 60 --overlap 10
        """
    )

    # Required arguments
    parser.add_argument(
        '-i', '--input',
        required=True,
        help='Input folder containing audio files or path to single audio file'
    )
    parser.add_argument(
        '-o', '--output',
        required=True,
        help='Output folder for processed WAV and NetCDF files'
    )

    # Audio processing options
    parser.add_argument(
        '--sample-rate',
        type=int,
        default=None,
        help='Target sample rate in Hz (default: keep original)'
    )
    parser.add_argument(
        '--snippet-duration',
        type=float,
        default=None,
        help='Duration of each snippet in seconds (default: no splitting)'
    )
    parser.add_argument(
        '--overlap',
        type=float,
        default=0.0,
        help='Overlap between snippets in seconds (default: 0)'
    )
    parser.add_argument(
        '--filename-prefix',
        type=str,
        default=None,
        help='Prefix to add to all output filenames (e.g., "site1" produces "site1_2024_01_01_00_00_00.wav")'
    )

    # Spectrogram options
    parser.add_argument(
        '--fft-sizes',
        type=parse_fft_sizes,
        default='2048',
        help='Comma-separated FFT sizes (default: 2048). Use multiple for multi-FFT output'
    )
    parser.add_argument(
        '--window',
        choices=['hann', 'hamming', 'blackman'],
        default='hann',
        help='Window function (default: hann)'
    )
    parser.add_argument(
        '--hop-length-factor',
        type=float,
        default=0.25,
        help='Hop length as fraction of FFT size (default: 0.25)'
    )
    parser.add_argument(
        '--db-ref',
        type=float,
        default=1.0,
        help='Reference value for dB conversion (default: 1.0). Ignored if --db-fullscale is set.'
    )
    parser.add_argument(
        '--db-fullscale',
        type=float,
        default=None,
        help='dB re 1 µPa value corresponding to digital full scale (max WAV value). '
             'When set, output is calibrated to dB re 1 µPa. Takes precedence over --db-ref.'
    )
    parser.add_argument(
        '--normalize-audio',
        action='store_true',
        help='Normalize audio to [-1, 1] before computing spectrogram'
    )
    parser.add_argument(
        '--compression-level',
        type=int,
        default=4,
        choices=range(0, 10),
        metavar='0-9',
        help='NetCDF zlib compression level 0-9 (0=none, 9=max). Default: 4'
    )

    # Other options
    parser.add_argument(
        '--datetime-format',
        type=str,
        default='%Y_%m_%d_%H_%M_%S',
        help='strptime format for parsing datetime from filenames (default: %%Y_%%m_%%d_%%H_%%M_%%S)'
    )
    parser.add_argument(
        '--no-preserve-timestamps',
        action='store_true',
        help='Do not preserve timestamps in snippet filenames'
    )
    parser.add_argument(
        '--extensions',
        type=str,
        default='.wav,.WAV',
        help='Comma-separated list of audio file extensions to process (default: .wav,.WAV)'
    )

    args = parser.parse_args()

    # Validate input
    input_path = Path(args.input)
    if not input_path.exists():
        print(f"Error: Input path does not exist: {args.input}", file=sys.stderr)
        return 1

    # Parse extensions
    extensions = [ext.strip() for ext in args.extensions.split(',')]

    # Create processor
    print("Initializing APLOSE Audio Processor...")
    print(f"  FFT sizes: {args.fft_sizes}")
    print(f"  Window: {args.window}")
    print(f"  Sample rate: {args.sample_rate if args.sample_rate else 'original'}")
    print(f"  Snippet duration: {args.snippet_duration if args.snippet_duration else 'full file'}")
    if args.snippet_duration:
        print(f"  Snippet overlap: {args.overlap}s")
    if args.filename_prefix:
        print(f"  Filename prefix: {args.filename_prefix}")
    if args.normalize_audio:
        print("  Audio normalization: enabled")
    if args.db_fullscale is not None:
        print(f"  dB full scale: {args.db_fullscale} dB re 1 µPa")
    else:
        print(f"  dB reference: {args.db_ref}")
    print(f"  Compression level: {args.compression_level}")

    processor = AploseAudioProcessor(
        fft_sizes=args.fft_sizes,
        window=args.window,
        hop_length_factor=args.hop_length_factor,
        db_ref=args.db_ref,
        db_fullscale=args.db_fullscale,
        normalize_audio=args.normalize_audio,
        compression_level=args.compression_level,
        datetime_format=args.datetime_format,
        target_sample_rate=args.sample_rate,
        snippet_duration=args.snippet_duration,
        snippet_overlap=args.overlap,
        filename_prefix=args.filename_prefix
    )

    # Process files
    try:
        if input_path.is_file():
            # Process single file
            results = processor.process_single_file(
                str(input_path),
                args.output,
                preserve_timestamps=not args.no_preserve_timestamps
            )
        else:
            # Process folder
            results = processor.process_folder(
                str(input_path),
                args.output,
                audio_extensions=extensions,
                preserve_timestamps=not args.no_preserve_timestamps
            )

        print(f"\nSuccess! Output written to: {args.output}")
        print(f"  WAV files: {len(results['wav_files'])}")
        print(f"  NetCDF files: {len(results['netcdf_files'])}")

        return 0

    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        return 1


if __name__ == '__main__':
    sys.exit(main())
