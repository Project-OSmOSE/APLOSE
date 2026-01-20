#!/usr/bin/env python3
"""
Command-line interface for generating spectrograms from WAV files
"""

import argparse
import logging
from pathlib import Path
from .generator import SpectrogramGenerator
from .dataset import SimpleDataset

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def generate_spectrograms(args):
    """Generate spectrograms from WAV files"""
    input_folder = Path(args.input)
    output_folder = Path(args.output) if args.output else input_folder

    logger.info(f"Input folder: {input_folder}")
    logger.info(f"Output folder: {output_folder}")

    generator = SpectrogramGenerator(
        nfft=args.nfft,
        hop_length=args.hop,
        window=args.window,
        ref_db=args.ref_db,
        datetime_format=args.datetime_format
    )

    results = generator.process_folder(input_folder, output_folder, args.pattern)

    logger.info(f"\n{'='*60}")
    logger.info(f"Successfully processed {len(results)} files")
    logger.info(f"{'='*60}")


def inspect_dataset(args):
    """Inspect a dataset folder"""
    folder = Path(args.folder)

    logger.info(f"Inspecting dataset: {folder}")
    logger.info(f"{'='*60}")

    with SimpleDataset(folder) as dataset:
        logger.info(f"Dataset name: {dataset.name}")
        logger.info(f"Number of spectrograms: {len(dataset.spectrograms)}")

        metadata = dataset.metadata
        if metadata.get('begin'):
            logger.info(f"Time range: {metadata['begin']} to {metadata.get('end', 'N/A')}")

        logger.info(f"\nSpectrograms:")
        logger.info(f"{'-'*60}")

        for i, spec in enumerate(dataset.spectrograms, 1):
            logger.info(f"\n{i}. {spec.netcdf_path.name}")
            logger.info(f"   WAV file: {spec.wav_path.name if spec.wav_path else 'Not found'}")

            meta = spec.metadata
            if meta.get('begin'):
                logger.info(f"   Time: {meta['begin']} to {meta.get('end', 'N/A')}")
            if meta.get('sample_rate'):
                logger.info(f"   Sample rate: {meta['sample_rate']} Hz")
            if meta.get('duration'):
                logger.info(f"   Duration: {meta['duration']:.2f} seconds")
            if meta.get('frequency_max'):
                logger.info(f"   Frequency range: {meta['frequency_min']:.1f} - {meta['frequency_max']:.1f} Hz")


def main():
    parser = argparse.ArgumentParser(
        description="APLOSE Spectrogram Generator - Convert WAV files to NetCDF spectrograms"
    )
    subparsers = parser.add_subparsers(dest='command', help='Available commands')

    # Generate command
    gen_parser = subparsers.add_parser('generate', help='Generate spectrograms from WAV files')
    gen_parser.add_argument(
        'input',
        type=str,
        help='Input folder containing WAV files'
    )
    gen_parser.add_argument(
        '-o', '--output',
        type=str,
        default=None,
        help='Output folder for NetCDF files (default: same as input)'
    )
    gen_parser.add_argument(
        '--nfft',
        type=int,
        default=2048,
        help='FFT window size (default: 2048)'
    )
    gen_parser.add_argument(
        '--hop',
        type=int,
        default=512,
        help='Hop length (default: 512)'
    )
    gen_parser.add_argument(
        '--window',
        type=str,
        default='hann',
        choices=['hann', 'hamming', 'blackman'],
        help='Window function (default: hann)'
    )
    gen_parser.add_argument(
        '--ref-db',
        type=float,
        default=1.0,
        help='Reference value for dB conversion (default: 1.0)'
    )
    gen_parser.add_argument(
        '--datetime-format',
        type=str,
        default='%Y_%m_%d_%H_%M_%S',
        help='Datetime format for parsing filenames (default: %%Y_%%m_%%d_%%H_%%M_%%S)'
    )
    gen_parser.add_argument(
        '--pattern',
        type=str,
        default='*.wav',
        help='Glob pattern for WAV files (default: *.wav)'
    )

    # Inspect command
    inspect_parser = subparsers.add_parser('inspect', help='Inspect a dataset folder')
    inspect_parser.add_argument(
        'folder',
        type=str,
        help='Dataset folder to inspect'
    )

    args = parser.parse_args()

    if args.command == 'generate':
        generate_spectrograms(args)
    elif args.command == 'inspect':
        inspect_dataset(args)
    else:
        parser.print_help()


if __name__ == '__main__':
    main()
