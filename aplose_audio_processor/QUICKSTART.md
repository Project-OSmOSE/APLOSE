# Quick Start Guide

Get started with APLOSE Audio Processor in 5 minutes!

## Installation

```bash
# Navigate to the package directory
cd examples/aplose_audio_processor

# Install the package
pip install -e .
```

## Basic Usage

### 1. Prepare Your Audio Files

Place your audio files in a folder:
```
my_audio/
├── recording1.wav
├── recording2.wav
└── recording3.wav
```

### 2. Process the Files

Run the processor:

```bash
aplose-audio-processor -i my_audio/ -o my_output/
```

This will create:
```
my_output/
├── recording1.wav (processed)
├── recording1.nc (spectrogram)
├── recording2.wav
├── recording2.nc
├── recording3.wav
└── recording3.nc
```

### 3. Import into APLOSE

```bash
# From the APLOSE root directory
python manage.py import_simple_dataset my_dataset my_output/
```

Done! Your data is now in APLOSE.

## Common Use Cases

### Resample Audio

Convert to 48kHz:
```bash
aplose-audio-processor -i audio/ -o output/ --sample-rate 48000
```

### Create Snippets

Split into 1-minute chunks:
```bash
aplose-audio-processor -i audio/ -o output/ --snippet-duration 60
```

### Multi-FFT

Generate multiple FFT sizes:
```bash
aplose-audio-processor -i audio/ -o output/ --fft-sizes 1024,2048,4096
```

### All Together

```bash
aplose-audio-processor -i audio/ -o output/ \
  --sample-rate 48000 \
  --snippet-duration 60 \
  --overlap 10 \
  --fft-sizes 1024,2048,4096
```

## Python API

```python
from aplose_audio_processor import AploseAudioProcessor

# Create processor
processor = AploseAudioProcessor(
    fft_sizes=[1024, 2048, 4096],
    target_sample_rate=48000,
    snippet_duration=60.0,
    snippet_overlap=10.0
)

# Process folder
results = processor.process_folder(
    input_folder='audio/',
    output_folder='output/'
)

print(f"Created {len(results['netcdf_files'])} spectrograms")
```

## Examples

See `example_usage.py` for detailed examples:

```bash
python example_usage.py
```

## Help

Get full documentation:

```bash
aplose-audio-processor --help
```

## Troubleshooting

### Import Error

If you get import errors, make sure you're in the right directory:
```bash
cd /path/to/APLOSE-IMR/examples/aplose_audio_processor
pip install -e .
```

### File Not Found

Make sure your input path exists:
```bash
ls -la /path/to/audio/
```

### NetCDF Files Not Compatible

Ensure you're using the latest version of the package and that your APLOSE installation supports the simple NetCDF format.

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check out [example_usage.py](example_usage.py) for code examples
- See APLOSE documentation for importing datasets

## Support

For issues: https://github.com/Project-ODE/APLOSE-IMR/issues
