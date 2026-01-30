# APLOSE NetCDF Example Dataset

This directory contains tools and examples for working with NetCDF spectrograms in APLOSE.

## Quick Start

### 1. Generate Example Dataset

Run the generator script to create a complete example dataset with NetCDF spectrograms:

```bash
# Install required dependencies (if not already installed)
pip install xarray netcdf4 numpy

# Generate the example dataset
python examples/generate_netcdf_dataset.py

# Or use a specific output location
python examples/generate_netcdf_dataset.py --output /opt/datawork/dataset --name my_netcdf_test
```

**Note:** The script requires Python 3.8+ with numpy, xarray, and netcdf4 installed. A template dataset structure is provided in `examples/example_datasets/netcdf_example/` that you can populate with your own NetCDF files if you prefer not to run the generator.

This will create a dataset structure with:
- 5 NetCDF spectrogram files with realistic acoustic data
- Complete OSEkit-compatible JSON configuration files
- Proper directory structure for APLOSE import
- **Automatic datasets.csv entry** - the script updates datasets.csv so the dataset is immediately discoverable

### 2. Import into APLOSE

#### Recommended: Generate Directly in Docker Volume

The easiest approach is to generate the dataset directly in the Docker volume:

```bash
# Generate dataset in Docker volume (creates and updates datasets.csv automatically)
python examples/generate_netcdf_dataset.py --output volumes/datawork/dataset --name netcdf_example
```

#### Alternative: Copy Existing Dataset

```bash
# For development/local testing
cp -r ./example_datasets/netcdf_example /opt/datawork/dataset/

# For Docker
cp -r ./example_datasets/netcdf_example ./volumes/datawork/dataset/

# Note: You may need to manually update datasets.csv if copying
```

### 3. Import into APLOSE

1. Start APLOSE (or restart if already running)
2. Navigate to the Dataset Import page in the web interface
3. Import the `netcdf_example` dataset:
   - **Legacy import**: Check the "Legacy" checkbox - uses CSV files
   - **OSEkit import**: Leave "Legacy" unchecked - uses JSON files
   - Both methods work with NetCDF spectrograms!
4. Create an annotation campaign using the imported dataset
5. Start annotating - you'll see the interactive NetCDF visualizations!

**Tip:** If you encounter import errors, try the other format. Legacy format is more battle-tested.

## Dataset Structure

The generated dataset includes **both OSEkit and Legacy formats** for maximum compatibility:

```
netcdf_example/
├── dataset.json                      # OSEkit main configuration
├── data/
│   └── audio/
│       ├── 10_48000/                 # Legacy format
│       │   ├── metadata.csv          # Audio metadata (CSV)
│       │   └── timestamp.csv         # File timestamps (CSV)
│       └── original/                 # OSEkit format
│           └── original.json         # Audio metadata (JSON)
└── processed/
    ├── netcdf_analysis/              # OSEkit format
    │   ├── netcdf_analysis.json      # Analysis configuration (JSON)
    │   └── spectrogram/
    │       ├── 2024_01_01_00_00_00_000000.nc
    │       ├── 2024_01_01_02_00_00_000000.nc
    │       ├── 2024_01_01_04_00_00_000000.nc
    │       ├── 2024_01_01_06_00_00_000000.nc
    │       └── 2024_01_01_08_00_00_000000.nc
    └── spectrogram/                  # Legacy format
        └── 10_48000/
            └── 2048_2048_1536_linear/
                ├── metadata.csv      # Spectrogram metadata (CSV)
                └── image/
                    ├── 2024_01_01_00_00_00_000000.nc
                    ├── 2024_01_01_02_00_00_000000.nc
                    ├── 2024_01_01_04_00_00_000000.nc
                    ├── 2024_01_01_06_00_00_000000.nc
                    └── 2024_01_01_08_00_00_000000.nc
```

**Note:** NetCDF files are duplicated in both locations to support either import method. Choose the format that works best for your workflow.

## NetCDF File Format

Each NetCDF file contains:

### Data Variables:
- `spectrogram`: 2D array (frequency × time) of power spectral density values in dB

### Coordinates:
- `time`: Array of time points in seconds
- `frequency`: Array of frequency bins in Hz

### Attributes:
- `begin`: Start timestamp (ISO format)
- `end`: End timestamp (ISO format)
- `sample_rate`: Audio sample rate (Hz)
- `window_size`: FFT window size
- `hop_size`: Hop size between windows
- `nfft`: FFT size
- `db_ref`: dB reference value
- `duration`: Total duration in seconds

## Customization

You can customize the generated dataset:

```bash
# Custom output location
python examples/generate_netcdf_dataset.py --output /path/to/output

# Custom dataset name
python examples/generate_netcdf_dataset.py --name my_dataset

# Both options
python examples/generate_netcdf_dataset.py --output /opt/datawork/dataset --name test_data
```

## Features of Generated Spectrograms

The example spectrograms include realistic acoustic features:

1. **Background Noise**: Pink noise-like spectrum typical of ocean environments
2. **Tonal Calls**:
   - Low-frequency upsweep (20-80 Hz) simulating whale calls
   - Mid-frequency downsweep (1500-3000 Hz) simulating other vocalizations
3. **Transients**: Impulsive broadband signals simulating clicks
4. **Continuous Tones**: Constant frequency component simulating boat noise

These features make the example data suitable for:
- Testing annotation workflows
- Demonstrating visualization capabilities
- Training new users
- Development and debugging

## Interactive Visualization Features

When viewing NetCDF spectrograms in APLOSE, you can:

- **Pan and Zoom**: Interactive navigation through the spectrogram
- **Adjust Colorscale**: Choose from 14 different colorscales (Jet, Viridis, Hot, etc.)
- **Adjust Thresholds**: Dynamic range control with min/max sliders
- **Hover Information**: See exact time, frequency, and power values
- **Annotate**: Draw boxes and points just like with PNG spectrograms

## Troubleshooting

### Import fails with "No spectrograms found"

Make sure:
1. NetCDF files are in the `processed/{analysis_name}/spectrogram/` directory
2. Files have the `.nc` extension
3. The analysis JSON file correctly references the spectrograms

### Visualization doesn't load

Check:
1. Backend dependencies are installed: `xarray` and `netcdf4`
2. Frontend dependencies are installed: `plotly.js` and `react-plotly.js`
3. Docker containers have been rebuilt if using Docker

### Python dependencies missing

```bash
# Install in the backend environment
cd /home/user/APLOSE-IMR
poetry install

# Or with pip
pip install xarray netcdf4 numpy
```

## Creating Your Own NetCDF Spectrograms

You can create NetCDF spectrograms from your own audio data:

```python
import xarray as xr
import numpy as np
from datetime import datetime

# Generate or load your spectrogram data
# spectrogram_data should be a 2D array (frequency x time)
spectrogram_data = ...  # Your spectrogram as numpy array
time_coords = ...       # Time coordinates in seconds
freq_coords = ...       # Frequency coordinates in Hz

# Create xarray Dataset
ds = xr.Dataset(
    {'spectrogram': (['frequency', 'time'], spectrogram_data)},
    coords={
        'time': time_coords,
        'frequency': freq_coords,
    },
    attrs={
        'begin': '2024-01-01T00:00:00+0000',
        'end': '2024-01-01T00:05:00+0000',
        'sample_rate': 48000.0,
        'window_size': 2048,
        'hop_size': 512,
        'nfft': 2048,
        'db_ref': 1.0,
        'duration': 300.0,
    }
)

# Save to NetCDF file with float16 encoding
encoding = {'spectrogram': {'dtype': 'float16'}}
ds.to_netcdf('spectrogram.nc', format='NETCDF4', encoding=encoding)
```

## Support

For issues or questions:
- Check the main APLOSE documentation
- Review the implementation in `backend/api/models/data/spectrogram.py`
- Check frontend component in `frontend/src/features/Annotator/Spectrogram/NetCDFSpectrogram.tsx`
