# APLOSE Audio Processor

A Python package to generate APLOSE-compatible NetCDF spectrogram files from audio files.

## Features

- **Audio Resampling**: Convert audio to different sample rates
- **Audio Snippets**: Split long recordings into shorter snippets with configurable overlap
- **Multi-FFT Support**: Generate spectrograms with multiple FFT sizes in a single NetCDF file
- **Batch Processing**: Process entire folders of audio files
- **APLOSE Compatible**: Outputs NetCDF files that work seamlessly with APLOSE

## Installation

### From Source

```bash
cd examples/aplose_audio_processor
pip install -e .
```

### Requirements

- Python >= 3.8
- numpy >= 1.20.0
- scipy >= 1.7.0
- xarray >= 2023.0.0
- netcdf4 >= 1.6.0
- soundfile >= 0.12.0

## Usage

### Command Line Interface

The package provides a command-line tool `aplose-audio-processor`:

#### Basic Usage

Process all audio files in a folder:

```bash
aplose-audio-processor -i /path/to/audio_files/ -o /path/to/output/
```

#### Resample Audio

Convert audio to 48kHz:

```bash
aplose-audio-processor -i audio_files/ -o output/ --sample-rate 48000
```

#### Create Audio Snippets

Split 10-minute recordings into 1-minute snippets:

```bash
aplose-audio-processor -i audio_files/ -o output/ --snippet-duration 60
```

#### Snippets with Overlap

Create 1-minute snippets with 10-second overlap:

```bash
aplose-audio-processor -i audio_files/ -o output/ \
  --snippet-duration 60 --overlap 10
```

#### Multi-FFT Spectrograms

Generate spectrograms with multiple FFT sizes (1024, 2048, 4096):

```bash
aplose-audio-processor -i audio_files/ -o output/ \
  --fft-sizes 1024,2048,4096
```

#### Complete Example

Resample to 48kHz, create 1-minute snippets, and generate multi-FFT spectrograms:

```bash
aplose-audio-processor -i audio_files/ -o output/ \
  --sample-rate 48000 \
  --snippet-duration 60 \
  --overlap 10 \
  --fft-sizes 1024,2048,4096 \
  --window hann
```

### Python API

#### Basic Example

```python
from aplose_audio_processor import AploseAudioProcessor

# Create processor with default settings
processor = AploseAudioProcessor(fft_sizes=2048)

# Process a folder
results = processor.process_folder(
    input_folder='audio_files/',
    output_folder='output/'
)

print(f"Generated {len(results['wav_files'])} WAV files")
print(f"Generated {len(results['netcdf_files'])} NetCDF files")
```

#### Advanced Example with Resampling and Snippets

```python
from aplose_audio_processor import AploseAudioProcessor

# Create processor with custom settings
processor = AploseAudioProcessor(
    fft_sizes=[1024, 2048, 4096],  # Multi-FFT
    window='hann',
    hop_length_factor=0.25,
    db_ref=1.0,
    target_sample_rate=48000,      # Resample to 48kHz
    snippet_duration=60.0,          # 1-minute snippets
    snippet_overlap=10.0            # 10-second overlap
)

# Process folder
results = processor.process_folder(
    input_folder='long_recordings/',
    output_folder='processed_snippets/',
    preserve_timestamps=True
)
```

#### Process Single File

```python
from aplose_audio_processor import AploseAudioProcessor

processor = AploseAudioProcessor(
    fft_sizes=2048,
    target_sample_rate=48000
)

results = processor.process_single_file(
    input_file='recording.wav',
    output_folder='output/'
)
```

## Output Format

The package generates two types of files:

### 1. WAV Files

Processed audio files (resampled and/or split into snippets):
- `recording_2024_01_15_08_30_00.wav`
- `recording_2024_01_15_08_31_00.wav` (if snippets are created)

### 2. NetCDF Files

APLOSE-compatible spectrogram files with the same basename:
- `recording_2024_01_15_08_30_00.nc`
- `recording_2024_01_15_08_31_00.nc`

### NetCDF Structure

#### Single-FFT Format

```
Dimensions:
  frequency: 1025 (FFT size // 2 + 1)
  time: variable

Variables:
  spectrogram(frequency, time): float64

Coordinates:
  frequency(frequency): float64 (Hz)
  time(time): float64 (seconds)

Attributes:
  begin: "2024-01-15T08:30:00"
  end: "2024-01-15T08:31:00"
  sample_rate: 48000.0
  nfft: 2048
  hop_length: 512
  window: "hann"
  duration: 60.0
  audio_file: "recording_2024_01_15_08_30_00.wav"
  db_ref: 1.0
```

#### Multi-FFT Format

```
Variables:
  spectrogram_fft1024(frequency_fft1024, time_fft1024): float64
  spectrogram_fft2048(frequency_fft2048, time_fft2048): float64
  spectrogram_fft4096(frequency_fft4096, time_fft4096): float64

Coordinates:
  frequency_fft1024(frequency_fft1024): float64
  time_fft1024(time_fft1024): float64
  ... (similar for other FFT sizes)

Attributes:
  fft_sizes: "1024,2048,4096"
  begin: "2024-01-15T08:30:00"
  end: "2024-01-15T08:31:00"
  sample_rate: 48000.0
  window: "hann"
  duration: 60.0
  audio_file: "recording_2024_01_15_08_30_00.wav"
  db_ref: 1.0
```

## File Naming

### Timestamp Preservation

When creating snippets, the package attempts to parse timestamps from filenames and adjust them for each snippet:

**Input:** `recording_2024_01_15_08_30_00.wav` (10 minutes)

**Output (60-second snippets):**
- `2024_01_15_08_30_00.wav` and `.nc` (0:00-1:00)
- `2024_01_15_08_31_00.wav` and `.nc` (1:00-2:00)
- `2024_01_15_08_32_00.wav` and `.nc` (2:00-3:00)
- ... etc.

### Supported Datetime Formats

Default format: `%Y_%m_%d_%H_%M_%S` (e.g., `2024_01_15_08_30_00`)

You can specify custom formats:

```bash
aplose-audio-processor -i audio/ -o output/ \
  --datetime-format "%Y%m%d_%H%M%S"
```

## CLI Options

| Option | Description | Default |
|--------|-------------|---------|
| `-i, --input` | Input folder or file | Required |
| `-o, --output` | Output folder | Required |
| `--sample-rate` | Target sample rate in Hz | Original |
| `--snippet-duration` | Snippet duration in seconds | No splitting |
| `--overlap` | Snippet overlap in seconds | 0 |
| `--fft-sizes` | Comma-separated FFT sizes | 2048 |
| `--window` | Window function (hann/hamming/blackman) | hann |
| `--hop-length-factor` | Hop length as fraction of FFT | 0.25 |
| `--db-ref` | Reference for dB conversion | 1.0 |
| `--datetime-format` | strptime format for filenames | %Y_%m_%d_%H_%M_%S |
| `--no-preserve-timestamps` | Don't preserve timestamps in snippets | False |
| `--extensions` | Audio file extensions to process | .wav,.WAV |

## Examples

### Example 1: Prepare Long Recordings for APLOSE

You have 1-hour whale recordings that you want to split into 5-minute snippets for easier annotation:

```bash
aplose-audio-processor -i whale_recordings/ -o aplose_dataset/ \
  --snippet-duration 300 \
  --fft-sizes 1024,2048,4096
```

This creates:
- 12 × 5-minute WAV files per original recording
- Corresponding NetCDF files with multi-FFT spectrograms
- Preserved timestamps in filenames

### Example 2: Downsample High Sample Rate Recordings

You have 192kHz recordings but want to work with 48kHz in APLOSE:

```bash
aplose-audio-processor -i high_res_audio/ -o downsampled/ \
  --sample-rate 48000 \
  --fft-sizes 2048
```

### Example 3: Create Overlapping Analysis Windows

For continuous monitoring with overlapping analysis windows:

```bash
aplose-audio-processor -i continuous_recordings/ -o overlapped/ \
  --snippet-duration 60 \
  --overlap 30 \
  --fft-sizes 2048
```

Creates 60-second snippets with 30-second overlap (50% overlap).

## Importing into APLOSE

After generating the NetCDF files, import them into APLOSE using:

```bash
python manage.py import_simple_dataset <dataset_name> /path/to/output/
```

The dataset will be available in APLOSE with:
- All spectrograms ready for visualization
- Multi-FFT support (if generated)
- Proper timestamp information
- Linked audio files (if available)

## License

This package is part of the APLOSE project and is licensed under the GNU General Public License v3.0.

## Support

For issues and questions:
- GitHub Issues: https://github.com/Project-ODE/APLOSE-IMR/issues
- Documentation: See APLOSE documentation for more details

## Credits

Part of the APLOSE (Audio Processing Learning fOr Species Estimation) project.
