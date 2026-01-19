# APLOSE Dataset Directory

This directory contains datasets that will be mounted into the APLOSE Docker container.

## Directory Structure

```
dataset/
├── datasets.csv           # Index file for legacy datasets (required)
└── [dataset_name]/        # Individual datasets
    ├── dataset.json       # OSEkit dataset configuration (new format)
    ├── data/
    │   └── audio/
    │       └── original/
    │           └── original.json
    └── processed/
        └── [analysis_name]/
            ├── [analysis_name].json
            └── spectrogram/
                ├── *.nc    # NetCDF spectrogram files
                └── *.png   # PNG spectrogram files (legacy)
```

## datasets.csv Format

The `datasets.csv` file is required for legacy datasets only. For new OSEkit-format datasets, this file can be empty (just headers).

**Headers:**
- `path`: Path to the dataset directory
- `dataset`: Dataset name
- `spectro_duration`: Spectrogram duration in seconds
- `dataset_sr`: Sample rate
- `file_type`: Audio file type (e.g., .wav)
- `identifier`: Optional identifier

**Example:**
```csv
path,dataset,spectro_duration,dataset_sr,file_type,identifier
my_dataset,my_dataset,600,480,.wav,
```

## Adding Datasets

### Option 1: Use the NetCDF Example Dataset

Copy the example dataset from the repository:

```bash
# From the repository root
cp -r examples/example_datasets/netcdf_example volumes/datawork/dataset/

# Generate the NetCDF files
python examples/generate_netcdf_dataset.py --output volumes/datawork/dataset --name netcdf_example
```

### Option 2: Create Your Own Dataset

1. Create a directory: `volumes/datawork/dataset/my_dataset/`
2. Add required files following the OSEkit format:
   - `dataset.json` - Main configuration
   - `data/audio/original/original.json` - Audio metadata
   - `processed/[analysis_name]/[analysis_name].json` - Analysis configuration
   - `processed/[analysis_name]/spectrogram/*.nc` - NetCDF spectrograms

See `examples/example_datasets/netcdf_example/` for a complete template.

### Option 3: Legacy Dataset

For legacy datasets:
1. Add an entry to `datasets.csv`
2. Place files in the expected legacy directory structure
3. Import with `legacy=true` flag

## Importing into APLOSE

Once your dataset is in this directory:

1. Start APLOSE: `docker compose --env-file test.env up -d`
2. Access the web interface: `http://localhost:8080`
3. Navigate to Dataset Management
4. Click "Import Dataset"
5. Select your dataset from the list

## Docker Mount

This directory is mounted into the Docker container at:
- `/opt/datawork/dataset` (read-only in production)

Changes made here are immediately visible to APLOSE.

## Notes

- The datasets.csv file must exist (even if empty) to avoid errors
- For NetCDF spectrograms, use the new OSEkit format (non-legacy)
- Keep this directory backed up - it contains your valuable data
- Large datasets may take time to import
