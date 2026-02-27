#!/usr/bin/env python3
"""
Basic test to verify the package works.

Creates a simple test audio file, processes it, and verifies the output.
"""

import os
import sys
import tempfile
import shutil
from pathlib import Path
import numpy as np
import soundfile as sf
import xarray as xr

# Add package to path if needed
package_dir = Path(__file__).parent
if (package_dir / '__init__.py').exists():
    # Running from package directory - add parent
    sys.path.insert(0, str(package_dir.parent))
else:
    sys.path.insert(0, str(package_dir))

from aplose_audio_processor import AploseAudioProcessor


def create_test_audio(output_path: str, duration: float = 5.0, sample_rate: int = 44100):
    """Create a simple test audio file with a sine wave."""
    t = np.linspace(0, duration, int(sample_rate * duration))
    # Create a sine wave at 440 Hz (A4 note)
    audio = 0.5 * np.sin(2 * np.pi * 440 * t)
    sf.write(output_path, audio, sample_rate)
    return output_path


def test_basic_processing():
    """Test basic processing without resampling or snippets."""
    print("Test 1: Basic Processing")
    print("-" * 40)

    with tempfile.TemporaryDirectory() as tmpdir:
        # Create test audio
        input_dir = os.path.join(tmpdir, 'input')
        output_dir = os.path.join(tmpdir, 'output')
        os.makedirs(input_dir)

        test_file = os.path.join(input_dir, '2024_01_15_08_30_00.wav')
        create_test_audio(test_file, duration=5.0, sample_rate=44100)

        # Process
        processor = AploseAudioProcessor(fft_sizes=2048)
        results = processor.process_folder(input_dir, output_dir)

        # Verify
        assert len(results['wav_files']) == 1, "Should create 1 WAV file"
        assert len(results['netcdf_files']) == 1, "Should create 1 NetCDF file"

        # Check NetCDF structure
        nc_path = results['netcdf_files'][0]
        ds = xr.open_dataset(nc_path)

        assert 'spectrogram' in ds.data_vars, "Should have spectrogram variable"
        assert 'frequency' in ds.coords, "Should have frequency coordinate"
        assert 'time' in ds.coords, "Should have time coordinate"
        assert 'sample_rate' in ds.attrs, "Should have sample_rate attribute"
        assert ds.attrs['nfft'] == 2048, "Should have correct FFT size"

        ds.close()

        print("✓ Basic processing works!")
        print(f"  Created: {Path(nc_path).name}")
        print()


def test_resampling():
    """Test audio resampling."""
    print("Test 2: Resampling")
    print("-" * 40)

    with tempfile.TemporaryDirectory() as tmpdir:
        input_dir = os.path.join(tmpdir, 'input')
        output_dir = os.path.join(tmpdir, 'output')
        os.makedirs(input_dir)

        test_file = os.path.join(input_dir, 'test.wav')
        create_test_audio(test_file, duration=2.0, sample_rate=44100)

        # Process with resampling
        processor = AploseAudioProcessor(
            fft_sizes=2048,
            target_sample_rate=16000
        )
        results = processor.process_folder(input_dir, output_dir)

        # Check sample rate
        wav_path = results['wav_files'][0]
        audio, sr = sf.read(wav_path)
        assert sr == 16000, f"Should be resampled to 16000 Hz, got {sr}"

        nc_path = results['netcdf_files'][0]
        ds = xr.open_dataset(nc_path)
        assert ds.attrs['sample_rate'] == 16000.0, "NetCDF should reflect new sample rate"
        ds.close()

        print("✓ Resampling works!")
        print(f"  Resampled from 44100 Hz to 16000 Hz")
        print()


def test_snippets():
    """Test snippet generation."""
    print("Test 3: Snippet Generation")
    print("-" * 40)

    with tempfile.TemporaryDirectory() as tmpdir:
        input_dir = os.path.join(tmpdir, 'input')
        output_dir = os.path.join(tmpdir, 'output')
        os.makedirs(input_dir)

        # Create 10-second audio
        test_file = os.path.join(input_dir, '2024_01_15_08_30_00.wav')
        create_test_audio(test_file, duration=10.0, sample_rate=16000)

        # Process with 3-second snippets
        processor = AploseAudioProcessor(
            fft_sizes=2048,
            snippet_duration=3.0
        )
        results = processor.process_folder(input_dir, output_dir)

        # Should create 4 snippets (0-3, 3-6, 6-9, 9-10)
        assert len(results['wav_files']) == 4, f"Should create 4 snippets, got {len(results['wav_files'])}"
        assert len(results['netcdf_files']) == 4, "Should create 4 NetCDF files"

        # Check durations
        for wav_path in results['wav_files']:
            audio, sr = sf.read(wav_path)
            duration = len(audio) / sr
            assert duration <= 3.0, f"Snippet should be <= 3 seconds, got {duration}"

        print("✓ Snippet generation works!")
        print(f"  Created {len(results['wav_files'])} snippets from 10-second file")
        print()


def test_multi_fft():
    """Test multi-FFT generation."""
    print("Test 4: Multi-FFT")
    print("-" * 40)

    with tempfile.TemporaryDirectory() as tmpdir:
        input_dir = os.path.join(tmpdir, 'input')
        output_dir = os.path.join(tmpdir, 'output')
        os.makedirs(input_dir)

        test_file = os.path.join(input_dir, 'test.wav')
        create_test_audio(test_file, duration=5.0, sample_rate=16000)

        # Process with multi-FFT
        processor = AploseAudioProcessor(
            fft_sizes=[1024, 2048, 4096]
        )
        results = processor.process_folder(input_dir, output_dir)

        # Check NetCDF structure
        nc_path = results['netcdf_files'][0]
        ds = xr.open_dataset(nc_path)

        # Should have 3 spectrogram variables
        assert 'spectrogram_fft1024' in ds.data_vars, "Should have FFT 1024"
        assert 'spectrogram_fft2048' in ds.data_vars, "Should have FFT 2048"
        assert 'spectrogram_fft4096' in ds.data_vars, "Should have FFT 4096"

        # Check attribute
        assert ds.attrs['fft_sizes'] == '1024,2048,4096', "Should have fft_sizes attribute"

        ds.close()

        print("✓ Multi-FFT works!")
        print(f"  Created NetCDF with 3 FFT sizes: 1024, 2048, 4096")
        print()


def main():
    """Run all tests."""
    print()
    print("=" * 60)
    print("APLOSE Audio Processor - Basic Tests")
    print("=" * 60)
    print()

    try:
        test_basic_processing()
        test_resampling()
        test_snippets()
        test_multi_fft()

        print("=" * 60)
        print("✓ All tests passed!")
        print("=" * 60)
        print()
        print("The package is working correctly.")
        print("You can now use it to process your audio files.")
        print()

        return 0

    except Exception as e:
        print()
        print("✗ Test failed!")
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == '__main__':
    sys.exit(main())
