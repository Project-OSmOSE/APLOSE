# APLOSE Audio Processor Package

## Overview

This package provides a complete solution for generating APLOSE-compatible NetCDF spectrogram files from audio recordings. It supports audio resampling, snippet generation, and multi-FFT spectrograms.

## Package Contents

```
aplose_audio_processor/
├── __init__.py              # Package initialization
├── __main__.py              # Module entry point (python -m aplose_audio_processor)
├── audio_processor.py       # Audio resampling and snippet generation
├── generator.py             # NetCDF generation and spectrogram calculation
├── cli.py                   # Command-line interface
├── setup.py                 # Installation script
├── requirements.txt         # Python dependencies
├── README.md                # Full documentation
├── QUICKSTART.md           # Quick start guide
├── PACKAGE_INFO.md         # This file
├── example_usage.py        # Python API examples
└── test_basic.py           # Basic functionality tests
```

## Features

### ✓ Audio Processing
- **Resampling**: Convert audio to any sample rate using high-quality sinc interpolation
- **Snippet Generation**: Split long recordings into shorter segments
- **Overlap Support**: Create overlapping snippets for continuous analysis
- **Timestamp Preservation**: Automatically adjust timestamps for snippets

### ✓ Spectrogram Generation
- **Single-FFT**: Standard spectrogram with one FFT size
- **Multi-FFT**: Multiple spectrograms with different FFT sizes in one file
- **Window Functions**: Support for Hann, Hamming, and Blackman windows
- **Configurable Parameters**: FFT size, hop length, dB reference

### ✓ APLOSE Compatibility
- **Format Compliance**: Generates NetCDF files compatible with APLOSE
- **Metadata**: Includes all required attributes (begin, end, sample_rate, etc.)
- **Multi-FFT Support**: Compatible with APLOSE's multi-FFT analysis feature

### ✓ Batch Processing
- **Folder Processing**: Process entire folders of audio files
- **Single File Processing**: Process individual files
- **Progress Reporting**: Clear output of processing status

## Installation

```bash
cd examples/aplose_audio_processor
pip install -e .
```

## Usage

### Command Line

```bash
# Basic usage
aplose-audio-processor -i audio/ -o output/

# With options
aplose-audio-processor -i audio/ -o output/ \
  --sample-rate 48000 \
  --snippet-duration 60 \
  --fft-sizes 1024,2048,4096
```

### Python API

```python
from aplose_audio_processor import AploseAudioProcessor

processor = AploseAudioProcessor(
    fft_sizes=[1024, 2048, 4096],
    target_sample_rate=48000,
    snippet_duration=60.0
)

results = processor.process_folder('audio/', 'output/')
```

## Testing

Run the test suite:

```bash
python test_basic.py
```

Tests verify:
- Basic processing functionality
- Audio resampling
- Snippet generation
- Multi-FFT spectrogram creation

## Dependencies

- numpy >= 1.20.0
- scipy >= 1.7.0
- xarray >= 2023.0.0
- netcdf4 >= 1.6.0
- soundfile >= 0.12.0

## Output Format

### WAV Files
Processed audio files (resampled and/or split):
- Same sample rate as specified (or original)
- PCM format compatible with most audio tools

### NetCDF Files
APLOSE-compatible spectrogram files:
- Same basename as WAV files
- Contains spectrogram data in dB scale
- Includes metadata (datetime, sample rate, FFT parameters)
- Multi-FFT files contain multiple spectrograms

## Workflow

1. **Prepare Audio**: Place audio files in a folder
2. **Process**: Run the processor with desired options
3. **Import**: Use `python manage.py import_simple_dataset` to import into APLOSE
4. **Analyze**: View and annotate in APLOSE web interface

## Examples

See `example_usage.py` for comprehensive examples including:
- Basic processing
- Resampling
- Snippet generation
- Overlapping snippets
- Multi-FFT spectrograms
- Complete workflows

## Documentation

- **README.md**: Full documentation
- **QUICKSTART.md**: Quick start guide
- **example_usage.py**: Code examples
- **CLI Help**: `aplose-audio-processor --help`

## Support

For issues and questions:
- GitHub Issues: https://github.com/Project-ODE/APLOSE-IMR/issues
- Documentation: See APLOSE documentation

## Version

Current version: 1.0.0

## License

GNU General Public License v3.0 (GPL-3.0)
Part of the APLOSE project.
