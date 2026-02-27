#!/usr/bin/env python3
"""
Example usage scripts for APLOSE Audio Processor.

This script demonstrates different use cases for the package.
"""

import sys
from pathlib import Path

# Add package to path if running from source
sys.path.insert(0, str(Path(__file__).parent))

from aplose_audio_processor import AploseAudioProcessor


def example_1_basic_processing():
    """Example 1: Basic processing with default settings."""
    print("=" * 60)
    print("Example 1: Basic Processing")
    print("=" * 60)
    print("Process audio files with default settings (2048 FFT, no resampling)")
    print()

    processor = AploseAudioProcessor(fft_sizes=2048)

    # Uncomment and modify paths to run:
    # results = processor.process_folder(
    #     input_folder='path/to/audio_files/',
    #     output_folder='path/to/output/'
    # )
    # print(f"Generated {len(results['wav_files'])} files")

    print("Code:")
    print("""
    processor = AploseAudioProcessor(fft_sizes=2048)
    results = processor.process_folder(
        input_folder='audio_files/',
        output_folder='output/'
    )
    """)
    print()


def example_2_resampling():
    """Example 2: Resample audio to different sample rate."""
    print("=" * 60)
    print("Example 2: Audio Resampling")
    print("=" * 60)
    print("Resample audio from any sample rate to 48kHz")
    print()

    processor = AploseAudioProcessor(
        fft_sizes=2048,
        target_sample_rate=48000  # Resample to 48kHz
    )

    print("Code:")
    print("""
    processor = AploseAudioProcessor(
        fft_sizes=2048,
        target_sample_rate=48000  # Resample to 48kHz
    )
    results = processor.process_folder(
        input_folder='high_sample_rate_audio/',
        output_folder='resampled_output/'
    )
    """)
    print()


def example_3_snippets():
    """Example 3: Create audio snippets."""
    print("=" * 60)
    print("Example 3: Create Audio Snippets")
    print("=" * 60)
    print("Split 10-minute recordings into 1-minute snippets")
    print()

    processor = AploseAudioProcessor(
        fft_sizes=2048,
        snippet_duration=60.0  # 1 minute = 60 seconds
    )

    print("Code:")
    print("""
    processor = AploseAudioProcessor(
        fft_sizes=2048,
        snippet_duration=60.0  # 1 minute
    )
    results = processor.process_folder(
        input_folder='long_recordings/',
        output_folder='snippets_output/'
    )
    """)
    print()


def example_4_snippets_with_overlap():
    """Example 4: Create overlapping snippets."""
    print("=" * 60)
    print("Example 4: Overlapping Snippets")
    print("=" * 60)
    print("Create 1-minute snippets with 10-second overlap")
    print()

    processor = AploseAudioProcessor(
        fft_sizes=2048,
        snippet_duration=60.0,  # 1 minute
        snippet_overlap=10.0    # 10 seconds overlap
    )

    print("Code:")
    print("""
    processor = AploseAudioProcessor(
        fft_sizes=2048,
        snippet_duration=60.0,  # 1 minute
        snippet_overlap=10.0    # 10 seconds overlap
    )
    results = processor.process_folder(
        input_folder='recordings/',
        output_folder='overlapped_output/'
    )
    """)
    print()


def example_5_multi_fft():
    """Example 5: Multi-FFT spectrograms."""
    print("=" * 60)
    print("Example 5: Multi-FFT Spectrograms")
    print("=" * 60)
    print("Generate spectrograms with multiple FFT sizes in one file")
    print()

    processor = AploseAudioProcessor(
        fft_sizes=[1024, 2048, 4096]  # Multiple FFT sizes
    )

    print("Code:")
    print("""
    processor = AploseAudioProcessor(
        fft_sizes=[1024, 2048, 4096]  # Multiple FFT sizes
    )
    results = processor.process_folder(
        input_folder='audio_files/',
        output_folder='multi_fft_output/'
    )
    """)
    print()


def example_6_complete_workflow():
    """Example 6: Complete workflow with all features."""
    print("=" * 60)
    print("Example 6: Complete Workflow")
    print("=" * 60)
    print("Resample + Snippets + Multi-FFT + Custom Settings")
    print()

    processor = AploseAudioProcessor(
        # Multi-FFT settings
        fft_sizes=[1024, 2048, 4096],
        window='hann',
        hop_length_factor=0.25,
        db_ref=1.0,

        # Audio processing
        target_sample_rate=48000,    # Resample to 48kHz
        snippet_duration=300.0,       # 5-minute snippets
        snippet_overlap=30.0,         # 30-second overlap

        # Datetime parsing
        datetime_format='%Y_%m_%d_%H_%M_%S'
    )

    print("Code:")
    print("""
    processor = AploseAudioProcessor(
        # Multi-FFT settings
        fft_sizes=[1024, 2048, 4096],
        window='hann',
        hop_length_factor=0.25,
        db_ref=1.0,

        # Audio processing
        target_sample_rate=48000,    # Resample to 48kHz
        snippet_duration=300.0,       # 5-minute snippets
        snippet_overlap=30.0,         # 30-second overlap

        # Datetime parsing
        datetime_format='%Y_%m_%d_%H_%M_%S'
    )
    results = processor.process_folder(
        input_folder='whale_recordings/',
        output_folder='aplose_dataset/'
    )
    """)
    print()


def example_7_single_file():
    """Example 7: Process a single file."""
    print("=" * 60)
    print("Example 7: Process Single File")
    print("=" * 60)
    print("Process just one audio file instead of a folder")
    print()

    processor = AploseAudioProcessor(
        fft_sizes=2048,
        target_sample_rate=48000
    )

    print("Code:")
    print("""
    processor = AploseAudioProcessor(
        fft_sizes=2048,
        target_sample_rate=48000
    )
    results = processor.process_single_file(
        input_file='recording_2024_01_15_08_30_00.wav',
        output_folder='output/'
    )
    """)
    print()


def example_8_custom_window():
    """Example 8: Use different window functions."""
    print("=" * 60)
    print("Example 8: Custom Window Functions")
    print("=" * 60)
    print("Use different window functions for spectrograms")
    print()

    # Hamming window
    processor_hamming = AploseAudioProcessor(
        fft_sizes=2048,
        window='hamming'
    )

    # Blackman window
    processor_blackman = AploseAudioProcessor(
        fft_sizes=2048,
        window='blackman'
    )

    print("Code:")
    print("""
    # Hamming window
    processor_hamming = AploseAudioProcessor(
        fft_sizes=2048,
        window='hamming'
    )

    # Blackman window
    processor_blackman = AploseAudioProcessor(
        fft_sizes=2048,
        window='blackman'
    )
    """)
    print()


def main():
    """Run all examples."""
    print()
    print("╔" + "═" * 58 + "╗")
    print("║" + " " * 10 + "APLOSE Audio Processor Examples" + " " * 16 + "║")
    print("╚" + "═" * 58 + "╝")
    print()
    print("This script demonstrates different use cases.")
    print("Modify the paths and uncomment the code to run the examples.")
    print()

    examples = [
        example_1_basic_processing,
        example_2_resampling,
        example_3_snippets,
        example_4_snippets_with_overlap,
        example_5_multi_fft,
        example_6_complete_workflow,
        example_7_single_file,
        example_8_custom_window,
    ]

    for example in examples:
        example()
        input("Press Enter to continue to next example...")
        print("\n")

    print("=" * 60)
    print("All examples shown!")
    print("=" * 60)
    print()
    print("Next steps:")
    print("1. Install the package: pip install -e .")
    print("2. Modify the examples above with your paths")
    print("3. Run your processing")
    print("4. Import into APLOSE: python manage.py import_simple_dataset <name> <path>")
    print()


if __name__ == '__main__':
    main()
