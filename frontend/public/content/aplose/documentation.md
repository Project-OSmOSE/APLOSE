# APLOSE Documentation

Audio Processing and Annotation Workflow Guide

---

## Overview

APLOSE (Annotation Platform for Ocean Sound Exploration) is a web-based tool for visualizing and annotating spectrograms from underwater acoustic recordings. The workflow consists of:

1. **Preprocessing** — Convert audio files to spectrogram data using the Python generator package
2. **Importing** — Load the processed dataset into APLOSE
3. **Annotating** — Create annotations on spectrograms using the web interface
4. **Exporting** — Download annotations in various formats for analysis

---

## Preprocessing Audio Data

### Installation

The audio processor package is located in the `aplose_audio_processor/` folder of the repository. Install it with:

```
cd aplose_audio_processor
pip install -e .
```

### Basic Usage

Use the command-line tool or the Python API to process audio files:

```
aplose-audio-processor \
  -i path/to/audio/files/ \
  -o path/to/output/ \
  --fft-sizes 4096,8192 \
  --snippet-duration 60 \
  --datetime-format "%Y%m%d_%H%M%S"
```

Or from Python:

```
from aplose_audio_processor import AploseAudioProcessor

processor = AploseAudioProcessor(
    fft_sizes=[4096, 8192, 16384],
    snippet_duration=60,
    snippet_overlap=0,
    target_sample_rate=None,
    datetime_format="%Y%m%d_%H%M%S",
    normalize_audio=False,
)

results = processor.process_folder(
    input_folder="path/to/audio/files",
    output_folder="path/to/output"
)
```

### Datetime Format

The processor extracts recording timestamps from filenames. Common formats:

- `%Y%m%d_%H%M%S` — e.g. `recording_20250130_223000.wav`
- `%Y_%m_%d_%H_%M_%S` — e.g. `recording_2025_01_30_22_30_00.wav`
- `%Y-%m-%d_%H-%M-%S` — e.g. `recording_2025-01-30_22-30-00.wav`

### Skipping the Start of a File

Use `--time-offset` to skip leading seconds (e.g. transient noise at deployment):

```
aplose-audio-processor -i audio/ -o output/ --time-offset 5.0
```

### Output Format

The processor generates two files per spectrogram:

- **PNG file** — 16-bit grayscale image containing the spectrogram power values
- **JSON file** — Metadata with frequency range, time range, FFT settings, and calibration info

Example JSON metadata:

```
{
  "format_version": 1,
  "png_file": "recording_2025_01_30_22_30_00_fft8192_data.png",
  "encoding": {
    "bit_depth": 16,
    "db_min": -120.0,
    "db_max": 0.0
  },
  "spectrogram": {
    "frequency_min": 10,
    "frequency_max": 24000,
    "frequency_scale": "log",
    "time_min": 0,
    "time_max": 60
  },
  "audio": {
    "sample_rate": 48000,
    "duration": 60,
    "filename": "recording_2025_01_30_22_30_00.wav"
  },
  "analysis": {
    "nfft": 8192,
    "hop_length": 4096,
    "window": "hann"
  },
  "temporal": {
    "begin": "2025-01-30T22:30:00",
    "end": "2025-01-30T22:31:00"
  }
}
```

For the full list of options see the [APLOSE Audio Processor README](https://github.com/sebastianmenze/APLOSE-IMR/tree/main/aplose_audio_processor).

---

## Importing into APLOSE

### Dataset Structure

Place your processed data in the following structure within `volumes/datawork/dataset/`:

```
volumes/datawork/dataset/
  your_dataset_name/
    dataset.json
    data/
      audio/
        original/
          original.json
    processed/
      analysis_name/
        analysis_name.json
```

### Import via Admin Interface

1. Log in to APLOSE as an administrator
2. Navigate to **Datasets** in the left panel
3. Click **Import Dataset**
4. Select your dataset folder from the dropdown
5. Review the configuration and click **Import**

### Verify Import

After importing, the dataset will appear in the Datasets list. Click on it to view the number of spectrograms, available FFT analyses, time range covered, and audio file information.

---

## Annotating Spectrograms

### Creating an Annotation Campaign

1. Go to **Annotation Campaigns**
2. Click **New Campaign**
3. Fill in the campaign details:
   - **Name** — Descriptive name for the campaign
   - **Dataset** — Select the imported dataset
   - **Label Set** — Choose or create annotation labels
   - **Annotators** — Assign users to the campaign
4. Click **Create Campaign**

### Spectrogram Viewer

The annotation interface provides several controls:

- **Y-Axis Scale** — Switch between linear and logarithmic frequency scale
- **Colorscale** — Choose from multiple color palettes (Viridis, Hot, Jet, etc.)
- **Intensity Range** — Adjust min/max dB values with sliders
- **Analysis Selection** — Switch between different FFT resolutions

### Creating Annotations

1. Select a label from the label panel on the right
2. Click and drag on the spectrogram to draw a bounding box
3. The annotation is saved automatically
4. To edit, click on an existing annotation and resize or move it
5. To delete, select the annotation and press Delete

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space | Play / Pause audio |
| Arrow Left / Right | Previous / Next spectrogram |
| 1–9 | Select label by number |
| Delete | Delete selected annotation |
| Escape | Deselect annotation |

### Audio Playback

Click anywhere on the spectrogram to seek to that time position. Use the play button or Space to start playback. A red vertical line shows the current playback position. Playback speed can be adjusted from 0.25× to 4×.

---

## Exporting Annotations

Navigate to your annotation campaign and click **Export** to download annotations.

### CSV Format

Standard tabular format:

```
filename,start_time,end_time,min_frequency,max_frequency,label,annotator,confidence
recording_001.wav,10.5,15.2,500,2000,whale_call,user1,0.95
recording_001.wav,22.1,24.8,1000,4000,dolphin_click,user1,0.87
```

### RAVEN Format

Compatible with Cornell Lab's Raven Pro software:

```
Selection  View         Channel  Begin Time (s)  End Time (s)  Low Freq (Hz)  High Freq (Hz)  Annotation
1          Spectrogram  1        10.5            15.2          500            2000            whale_call
2          Spectrogram  1        22.1            24.8          1000           4000            dolphin_click
```

### JSON Format

Full annotation data with metadata:

```
{
  "campaign": "My Campaign",
  "dataset": "My Dataset",
  "annotations": [
    {
      "id": 1,
      "spectrogram": "recording_001",
      "label": "whale_call",
      "start_time": 10.5,
      "end_time": 15.2,
      "min_frequency": 500,
      "max_frequency": 2000,
      "annotator": "user1",
      "created_at": "2025-01-30T10:00:00Z"
    }
  ]
}
```

---

For additional help, visit the [APLOSE GitHub repository](https://github.com/sebastianmenze/APLOSE-IMR) or contact the development team.
