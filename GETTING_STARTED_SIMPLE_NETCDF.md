# Getting Started with Simple NetCDF Datasets

This guide will walk you through using the new simplified NetCDF dataset architecture in APLOSE.

## Quick Start (5 Minutes)

### 1. Generate Example Dataset

```bash
# Create a simple example dataset with 5 WAV files and spectrograms
python examples/create_simple_example_dataset.py volumes/datawork/dataset/example_marine_mammals -n 5
```

This creates:
- `example_marine_mammals/2024_01_15_08_00_00.wav` + `.nc`
- `example_marine_mammals/2024_01_15_08_10_00.wav` + `.nc`
- `example_marine_mammals/2024_01_15_08_20_00.wav` + `.nc`
- `example_marine_mammals/2024_01_15_08_30_00.wav` + `.nc`
- `example_marine_mammals/2024_01_15_08_40_00.wav` + `.nc`

### 2. Start APLOSE

```bash
docker compose --env-file test.env up -d --build
```

Wait for containers to start (about 30 seconds).

### 3. Import Dataset

Access the GraphQL API at `http://localhost:8080/graphql` and run:

```graphql
mutation {
  importSimpleDataset(
    name: "Marine Mammals Example"
    path: "example_marine_mammals"
  ) {
    ok
    message
  }
}
```

### 4. Start Annotating!

Go to `http://localhost:8080`, login, and create an annotation campaign with your new dataset.

---

## Complete Workflow

### Step 1: Prepare Your Audio Files

Organize your WAV files with datetime in filenames:

```
my_deployment/
├── hydrophone_2024_01_15_08_00_00.wav
├── hydrophone_2024_01_15_09_00_00.wav
└── hydrophone_2024_01_15_10_00_00.wav
```

**Filename Format Requirements:**
- Must contain date and time
- Default format: `YYYY_MM_DD_HH_MM_SS`
- Prefix/suffix allowed: `prefix_2024_01_15_08_00_00_suffix.wav`

### Step 2: Generate Spectrograms

**Option A: Using Python API**

```python
from backend.utils.spectrogram import SpectrogramGenerator

generator = SpectrogramGenerator(
    nfft=2048,
    hop_length=512,
    window='hann',
    datetime_format='hydrophone_%Y_%m_%d_%H_%M_%S'  # Match your filenames
)

generator.process_folder('my_deployment')
```

**Option B: Using Command Line**

```bash
python -m backend.utils.spectrogram.cli generate my_deployment \
    --nfft 2048 \
    --hop 512 \
    --datetime-format "hydrophone_%Y_%m_%d_%H_%M_%S"
```

**Option C: Custom Script**

```python
#!/usr/bin/env python3
from pathlib import Path
from backend.utils.spectrogram import SpectrogramGenerator

# Configure for your deployment
generator = SpectrogramGenerator(
    nfft=4096,          # Higher resolution
    hop_length=1024,    # Longer hop for faster processing
    window='hamming',   # Window function
    datetime_format='%Y%m%d_%H%M%S'  # Compact format
)

# Process all WAV files
input_folder = Path('my_deployment')
results = generator.process_folder(input_folder)

print(f"Processed {len(results)} files")
```

### Step 3: Copy to Docker Volume

```bash
# Copy dataset to Docker volume
cp -r my_deployment volumes/datawork/dataset/

# Verify files are there
ls -lh volumes/datawork/dataset/my_deployment/
```

**Expected output:**
```
-rw-r--r-- 1 user user  48M Jan 15 08:00 hydrophone_2024_01_15_08_00_00.wav
-rw-r--r-- 1 user user 7.4M Jan 15 08:00 hydrophone_2024_01_15_08_00_00.nc
-rw-r--r-- 1 user user  48M Jan 15 09:00 hydrophone_2024_01_15_09_00_00.wav
-rw-r--r-- 1 user user 7.4M Jan 15 09:00 hydrophone_2024_01_15_09_00_00.nc
...
```

### Step 4: Import to APLOSE

**Option A: GraphQL Playground**

1. Navigate to `http://localhost:8080/graphql`
2. Run mutation:

```graphql
mutation ImportMyDataset {
  importSimpleDataset(
    name: "My Deployment"
    path: "my_deployment"
  ) {
    ok
    message
  }
}
```

**Option B: Python Script**

```python
import requests

url = "http://localhost:8080/graphql"
query = """
mutation {
  importSimpleDataset(
    name: "My Deployment"
    path: "my_deployment"
  ) {
    ok
    message
  }
}
"""

response = requests.post(url, json={'query': query})
print(response.json())
```

**Expected Response:**
```json
{
  "data": {
    "importSimpleDataset": {
      "ok": true,
      "message": "Successfully imported dataset 'My Deployment' with 3 spectrograms. (0 already existed)"
    }
  }
}
```

### Step 5: Create Annotation Campaign

1. **Login** to APLOSE at `http://localhost:8080`
2. **Navigate** to "Annotation Campaigns"
3. **Create Campaign**:
   - Name: "Marine Mammal Survey 2024"
   - Dataset: Select "My Deployment"
   - Labels: Add your species labels
   - Annotators: Add team members
4. **Start Annotating**: Browse spectrograms and create annotations!

---

## Advanced Usage

### Custom Datetime Formats

Different deployments use different filename conventions. Configure the datetime format to match:

```python
# Format: device_20240115_0830.wav
generator = SpectrogramGenerator(
    datetime_format='device_%Y%m%d_%H%M'
)

# Format: 2024-01-15T08-30-00.wav
generator = SpectrogramGenerator(
    datetime_format='%Y-%m-%dT%H-%M-%S'
)

# Format: recording_Jan15_2024_08h30m00s.wav
generator = SpectrogramGenerator(
    datetime_format='recording_%b%d_%Y_%Hh%Mm%Ss'
)
```

[Full strptime format reference](https://docs.python.org/3/library/datetime.html#strftime-and-strptime-format-codes)

### High-Resolution Spectrograms

For cetacean calls, bird songs, or detailed analysis:

```python
generator = SpectrogramGenerator(
    nfft=8192,         # Very high frequency resolution
    hop_length=512,    # High temporal resolution
    window='blackman'  # Better sidelobe suppression
)
```

**Trade-offs:**
- Higher `nfft` = better frequency resolution, worse time resolution
- Lower `hop_length` = better time resolution, larger files
- Different windows trade between frequency resolution and spectral leakage

### Batch Processing

Process multiple folders at once:

```python
from pathlib import Path
from backend.utils.spectrogram import SpectrogramGenerator

generator = SpectrogramGenerator(
    nfft=2048,
    hop_length=512,
    datetime_format='%Y_%m_%d_%H_%M_%S'
)

# Process all deployment folders
base_path = Path('deployments')
for deployment_folder in base_path.iterdir():
    if deployment_folder.is_dir():
        print(f"\nProcessing: {deployment_folder.name}")
        results = generator.process_folder(deployment_folder)
        print(f"  → {len(results)} spectrograms generated")
```

### Inspect Dataset

Check dataset contents before importing:

```bash
python -m backend.utils.spectrogram.cli inspect volumes/datawork/dataset/my_deployment
```

**Output:**
```
Inspecting dataset: volumes/datawork/dataset/my_deployment
============================================================
Dataset name: my_deployment
Number of spectrograms: 3

Spectrograms:
------------------------------------------------------------

1. hydrophone_2024_01_15_08_00_00.nc
   WAV file: hydrophone_2024_01_15_08_00_00.wav
   Time: 2024-01-15T08:00:00 to 2024-01-15T08:00:10
   Sample rate: 48000.0 Hz
   Duration: 10.00 seconds
   Frequency range: 0.0 - 24000.0 Hz

2. hydrophone_2024_01_15_09_00_00.nc
   ...
```

### Working with Existing Spectrograms

If you already have NetCDF spectrograms from another tool:

```python
from backend.utils.spectrogram.dataset import SimpleDataset

# Load existing dataset
with SimpleDataset('my_existing_spectrograms') as dataset:
    print(f"Found {len(dataset.spectrograms)} spectrograms")

    for spec in dataset.spectrograms:
        meta = spec.metadata
        print(f"- {spec.netcdf_path.name}")
        print(f"  Begin: {meta.get('begin')}")
        print(f"  Duration: {meta.get('duration')}s")
```

**Required NetCDF Structure:**
```
Dimensions:
  frequency: N
  time: M

Variables:
  spectrogram[frequency, time]: 2D array

Attributes:
  begin: ISO datetime string
  end: ISO datetime string
  sample_rate: float
  duration: float
  (optional) nfft, hop_length, window, etc.
```

---

## Troubleshooting

### Problem: "NetCDF file not found"

**Check:**
1. Files are in the correct location:
   ```bash
   ls volumes/datawork/dataset/your_dataset/
   ```
2. Paths in mutation match folder names exactly (case-sensitive)

### Problem: "Failed to parse datetime from filename"

**Solution:**
- Ensure `datetime_format` matches your filenames exactly
- Check for extra characters or different separators
- Verify date is complete (year, month, day, hour, minute, second)

**Example diagnosis:**
```python
from datetime import datetime

# Your filename
filename = "rec_20240115_0830.wav"

# Try different formats
formats = [
    "%Y%m%d_%H%M",           # 20240115_0830
    "rec_%Y%m%d_%H%M",       # rec_20240115_0830
    "rec_%Y_%m_%d_%H_%M",    # rec_2024_01_15_08_30
]

for fmt in formats:
    try:
        dt = datetime.strptime(filename.replace('.wav', ''), fmt)
        print(f"✓ Format works: {fmt}")
        print(f"  Parsed: {dt}")
    except ValueError:
        print(f"✗ Format failed: {fmt}")
```

### Problem: Import succeeds but no spectrograms visible

**Check:**
1. Spectrograms were actually imported:
   ```graphql
   query {
     allSpectrogramAnalysis(datasetId: YOUR_DATASET_ID) {
       edges {
         node {
           id
           name
           start
           end
         }
       }
     }
   }
   ```

2. Files are readable by Docker:
   ```bash
   docker compose --env-file test.env exec osmose_back ls -la /opt/datawork/dataset/your_dataset/
   ```

### Problem: Spectrograms look wrong

**Check FFT parameters:**
- Too low `nfft`: Blurry frequency axis
- Too high `nfft`: Blurry time axis
- Wrong `hop_length`: Gaps or overlap artifacts

**Recommended starting points:**
- Fish/cetaceans (low freq): `nfft=4096, hop=1024`
- General purpose: `nfft=2048, hop=512`
- Birds (high freq): `nfft=1024, hop=256`

### Problem: Large NetCDF files

**Optimize:**
```python
# Use larger hop for storage efficiency
generator = SpectrogramGenerator(
    nfft=2048,
    hop_length=1024,  # 2x hop = half the size
)
```

**Or downsample after generation:**
```python
import xarray as xr

# Load and downsample
ds = xr.open_dataset('large_spectrogram.nc')
ds_downsampled = ds.isel(time=slice(None, None, 2))  # Keep every 2nd time point
ds_downsampled.to_netcdf('smaller_spectrogram.nc')
```

---

## Performance Tips

### 1. Parallel Processing

```python
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path
from backend.utils.spectrogram import SpectrogramGenerator

def process_file(wav_path):
    generator = SpectrogramGenerator()
    generator.wav_to_spectrogram(wav_path)
    return wav_path.name

wav_files = list(Path('my_deployment').glob('*.wav'))

with ProcessPoolExecutor(max_workers=4) as executor:
    results = list(executor.map(process_file, wav_files))

print(f"Processed {len(results)} files in parallel")
```

### 2. Incremental Updates

Only process new files:

```python
from pathlib import Path

folder = Path('my_deployment')

# Get all WAV files without corresponding NetCDF
wav_files = set(folder.glob('*.wav'))
nc_files = set(f.with_suffix('.wav') for f in folder.glob('*.nc'))
new_files = wav_files - nc_files

print(f"Found {len(new_files)} new files to process")

generator = SpectrogramGenerator()
for wav_file in new_files:
    generator.wav_to_spectrogram(wav_file)
```

### 3. Monitoring Progress

```python
from tqdm import tqdm

wav_files = list(Path('my_deployment').glob('*.wav'))
generator = SpectrogramGenerator()

for wav_file in tqdm(wav_files, desc="Generating spectrograms"):
    generator.wav_to_spectrogram(wav_file)
```

---

## Migrating from OSEkit

If you have existing OSEkit datasets, you can migrate to the simple structure:

### Migration Script

```python
#!/usr/bin/env python3
"""
Migrate OSEkit dataset to simple NetCDF structure
"""
from pathlib import Path
import shutil
from backend.utils.spectrogram import SpectrogramGenerator

# Old OSEkit structure
osekit_dataset = Path('volumes/datawork/dataset/old_osekit_dataset')
osekit_wav = osekit_dataset / 'data' / 'audio' / 'original'
osekit_spectro = osekit_dataset / 'processed' / 'netcdf_analysis' / 'spectrogram'

# New simple structure
new_dataset = Path('volumes/datawork/dataset/migrated_dataset')
new_dataset.mkdir(parents=True, exist_ok=True)

# Copy WAV files
if osekit_wav.exists():
    for wav_file in osekit_wav.glob('*.wav'):
        shutil.copy2(wav_file, new_dataset / wav_file.name)
        print(f"Copied WAV: {wav_file.name}")

# Copy or regenerate spectrograms
if osekit_spectro.exists():
    for nc_file in osekit_spectro.glob('*.nc'):
        shutil.copy2(nc_file, new_dataset / nc_file.name)
        print(f"Copied NC: {nc_file.name}")
else:
    # Regenerate from WAV
    print("Regenerating spectrograms...")
    generator = SpectrogramGenerator()
    generator.process_folder(new_dataset)

print(f"\n✓ Migration complete: {new_dataset}")
```

---

## Next Steps

- **Read**: [SIMPLE_DATASET_ARCHITECTURE.md](./SIMPLE_DATASET_ARCHITECTURE.md) for technical details
- **Explore**: Example dataset in `volumes/datawork/dataset/example_marine_mammals/`
- **Customize**: Adjust FFT parameters for your specific audio content
- **Scale**: Process your full deployment using parallel processing

**Questions?** Check the [GitHub Issues](https://github.com/your-org/APLOSE-IMR/issues) or documentation.

---

**Version**: 1.0
**Date**: 2026-01-20
**Compatibility**: APLOSE with simple NetCDF architecture
