# Simple Dataset Architecture for APLOSE

## Overview

This document describes the new simplified dataset architecture for APLOSE, which replaces the complex OSEkit structure with a straightforward folder-based approach.

## Motivation

The previous OSEkit-based structure was complex, requiring:
- Multiple nested JSON files with absolute paths
- Separate audio and spectrogram directories
- Complex configuration files
- PNG spectrograms or complex NetCDF structures

The new architecture simplifies this to:
- **One folder** containing WAV files and NetCDF spectrograms
- **Automatic** datetime parsing from filenames
- **No** complex configuration needed
- **Only NetCDF** spectrograms (PNG support removed)

## Dataset Structure

### Simple Folder Layout

```
dataset_name/
├── recording_2024_01_15_08_30_00.wav
├── recording_2024_01_15_08_30_00.nc
├── recording_2024_01_15_09_00_00.wav
├── recording_2024_01_15_09_00_00.nc
├── recording_2024_01_15_09_30_00.wav
├── recording_2024_01_15_09_30_00.nc
└── metadata.json  (optional)
```

### File Requirements

1. **WAV files**: Standard audio files with datetime encoded in filename
2. **NetCDF files**: Spectrograms with matching names (e.g., `file.wav` → `file.nc`)
3. **metadata.json** (optional): Dataset-level metadata

### NetCDF Spectrogram Format

Each NetCDF file contains:

**Dimensions:**
- `frequency`: Frequency bins (Hz)
- `time`: Time frames (seconds)

**Variables:**
- `spectrogram[frequency, time]`: 2D spectrogram data in dB

**Attributes:**
- `begin`: ISO format datetime of recording start
- `end`: ISO format datetime of recording end
- `sample_rate`: Audio sample rate (Hz)
- `nfft`: FFT size
- `hop_length`: Hop length for STFT
- `window`: Window function used ('hann', 'hamming', 'blackman')
- `duration`: Recording duration (seconds)
- `audio_file`: Original WAV filename

## Python Package: `backend.utils.spectrogram`

### SpectrogramGenerator

Generate NetCDF spectrograms from WAV files.

```python
from backend.utils.spectrogram import SpectrogramGenerator

# Initialize generator
generator = SpectrogramGenerator(
    nfft=2048,                              # FFT size
    hop_length=512,                          # Hop length
    window='hann',                           # Window function
    datetime_format='%Y_%m_%d_%H_%M_%S'     # Filename format
)

# Process single file
ds, output_path = generator.wav_to_spectrogram('recording.wav')

# Process entire folder
results = generator.process_folder('path/to/dataset')
```

### SimpleDataset

Read and interact with a dataset folder.

```python
from backend.utils.spectrogram import SimpleDataset

# Open dataset
with SimpleDataset('path/to/dataset') as dataset:
    print(f"Dataset: {dataset.name}")
    print(f"Spectrograms: {len(dataset.spectrograms)}")

    # Iterate through spectrograms
    for spec in dataset.spectrograms:
        print(f"- {spec.netcdf_path.name}")
        print(f"  Begin: {spec.metadata['begin']}")
        print(f"  Duration: {spec.metadata['duration']}s")

        # Load full dataset if needed
        ds = spec.load_dataset()
        spectrogram_data = ds['spectrogram'].values
```

### CLI Tool

Generate spectrograms from command line:

```bash
# Generate spectrograms
python -m backend.utils.spectrogram.cli generate /path/to/wav_files \\
    --nfft 2048 \\
    --hop 512 \\
    --datetime-format "%Y_%m_%d_%H_%M_%S"

# Inspect dataset
python -m backend.utils.spectrogram.cli inspect /path/to/dataset
```

## Datetime Parsing from Filenames

The system automatically extracts datetime information from filenames using configurable formats:

### Default Format

`%Y_%m_%d_%H_%M_%S` → `2024_01_15_08_30_00.wav`

### Custom Formats

You can specify any strptime format:

```python
# Example: 2024-01-15_0830.wav
generator = SpectrogramGenerator(
    datetime_format='%Y-%m-%d_%H%M'
)

# Example: 20240115T083000.wav
generator = SpectrogramGenerator(
    datetime_format='%Y%m%dT%H%M%S'
)
```

### Fallback

If datetime parsing fails, the system uses file modification time as fallback.

## Backend Changes

### Dataset Model

Simplified `Dataset` model removes OSEkit dependency:

```python
class Dataset(AbstractDataset, models.Model):
    def get_simple_dataset(self) -> SimpleDataset:
        """Get SimpleDataset object for this dataset"""
        dataset_path = settings.DATASET_IMPORT_FOLDER / self.path
        return SimpleDataset(dataset_path)
```

### Import Mutation

New `ImportSimpleDatasetMutation` replaces complex OSEkit import:

```graphql
mutation {
  importSimpleDataset(
    name: "My Dataset"
    path: "dataset_folder"
  ) {
    ok
    message
  }
}
```

The mutation:
1. Validates folder exists
2. Scans for NetCDF files
3. Matches WAV files
4. Creates `Dataset` and `SpectrogramAnalysis` records
5. Stores metadata

### Dependencies

**Removed:**
- `osekit`

**Added:**
- `soundfile` (for reading WAV files)

**Kept:**
- `xarray` (for NetCDF handling)
- `netcdf4` (NetCDF backend)

## Migration from OSEkit Structure

If you have existing OSEkit datasets, you can migrate them:

### Option 1: Keep Spectrograms

If you have NetCDF spectrograms in OSEkit format:

```bash
# Copy spectrograms to simple structure
cp processed/netcdf_analysis/spectrogram/*.nc new_dataset/
cp data/audio/original/*.wav new_dataset/
```

### Option 2: Regenerate

If you have WAV files, regenerate spectrograms:

```bash
python -m backend.utils.spectrogram.cli generate \\
    old_dataset/data/audio/original \\
    -o new_dataset
```

## Workflow Example

### 1. Prepare WAV Files

Organize your WAV files with datetime in filenames:

```
my_deployment/
├── AURAL_2024_01_15_08_00_00.wav
├── AURAL_2024_01_15_08_10_00.wav
└── AURAL_2024_01_15_08_20_00.wav
```

### 2. Generate Spectrograms

```python
from backend.utils.spectrogram import SpectrogramGenerator

generator = SpectrogramGenerator(
    nfft=2048,
    hop_length=512,
    datetime_format='AURAL_%Y_%m_%d_%H_%M_%S'
)

generator.process_folder('my_deployment')
```

This creates:
```
my_deployment/
├── AURAL_2024_01_15_08_00_00.wav
├── AURAL_2024_01_15_08_00_00.nc  ← New!
├── AURAL_2024_01_15_08_10_00.wav
├── AURAL_2024_01_15_08_10_00.nc  ← New!
├── AURAL_2024_01_15_08_20_00.wav
└── AURAL_2024_01_15_08_20_00.nc  ← New!
```

### 3. Import to APLOSE

Place folder in Docker volume:
```bash
cp -r my_deployment volumes/datawork/dataset/
```

Import via GraphQL:
```graphql
mutation {
  importSimpleDataset(
    name: "My Deployment"
    path: "my_deployment"
  ) {
    ok
    message
  }
}
```

### 4. Annotate

Use APLOSE web interface to:
- Browse spectrograms
- Create annotations
- Manage annotation campaigns

## Benefits

### Simplified Structure
- **One folder** instead of nested directories
- **No complex JSON** configuration files
- **Easy to understand** and manage

### Flexible Datetime Parsing
- **Configurable format** for different filename conventions
- **Automatic extraction** from filenames
- **Fallback** to file modification time

### Better Performance
- **Direct NetCDF access** without OSEkit overhead
- **Lazy loading** of spectrogram data
- **Efficient metadata** queries

### Easier Debugging
- **Clear error messages**
- **Simple file structure** to inspect
- **Standard formats** (WAV, NetCDF)

## API Reference

### SpectrogramGenerator

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| nfft | int | 2048 | FFT window size |
| hop_length | int | 512 | Samples between frames |
| window | str | 'hann' | Window function |
| ref_db | float | 1.0 | Reference for dB conversion |
| datetime_format | str | '%Y_%m_%d_%H_%M_%S' | strptime format |

### SimpleDataset

| Property | Type | Description |
|----------|------|-------------|
| folder | Path | Dataset folder path |
| name | str | Dataset name (folder name) |
| spectrograms | List[SpectrogramFile] | List of spectrograms |
| metadata | Dict | Dataset-level metadata |

### SpectrogramFile

| Property | Type | Description |
|----------|------|-------------|
| netcdf_path | Path | Path to NetCDF file |
| wav_path | Path | Path to WAV file (if exists) |
| metadata | Dict | Spectrogram metadata |

## Future Enhancements

Potential improvements for future versions:

1. **Parallel processing**: Multi-threaded spectrogram generation
2. **Incremental updates**: Only process new/modified files
3. **Custom STFT**: Allow custom window functions and parameters
4. **Audio formats**: Support for FLAC, MP3, etc.
5. **Compression**: NetCDF compression options
6. **Validation**: Automated checks for data quality

## Support

For questions or issues:
1. Check this documentation
2. Review example datasets
3. Open GitHub issue

---

**Version**: 1.0
**Date**: 2026-01-20
**Author**: APLOSE Development Team
