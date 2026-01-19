#!/usr/bin/env python3
"""
Generate example NetCDF spectrogram dataset for APLOSE

This script creates a complete OSEkit-compatible dataset with NetCDF spectrograms
that can be imported into APLOSE for testing and demonstration purposes.
"""

import os
import csv
import json
import numpy as np
from pathlib import Path
from datetime import datetime, timedelta
import argparse

try:
    import xarray as xr
except ImportError:
    print("Error: xarray is required. Install with: pip install xarray netcdf4")
    exit(1)


def generate_realistic_spectrogram(
    duration: float = 10.0,
    sample_rate: int = 48000,
    window_size: int = 2048,
    hop_size: int = 512,
    add_signals: bool = True,
):
    """Generate a realistic spectrogram with noise and optional signals"""

    # Calculate dimensions
    nfft = window_size
    time_samples = int(duration * sample_rate)
    n_frames = int((time_samples - window_size) / hop_size) + 1
    n_freqs = nfft // 2 + 1

    # Create time and frequency arrays
    times = np.linspace(0, duration, n_frames)
    freqs = np.fft.rfftfreq(nfft, 1/sample_rate)

    # Generate background noise (pink noise-like)
    spectrogram = np.random.randn(n_freqs, n_frames)

    # Apply frequency-dependent attenuation (realistic ocean noise)
    freq_attenuation = 1.0 / (1.0 + (freqs[:, np.newaxis] / 5000) ** 2)
    spectrogram = spectrogram * freq_attenuation

    if add_signals:
        # Add some tonal signals (simulating whale calls, boat noise, etc.)

        # Tonal call 1: Low-frequency upsweep (like fin whale)
        t1_start, t1_end = duration * 0.2, duration * 0.4
        f1_start, f1_end = 20, 80
        mask1 = (times >= t1_start) & (times <= t1_end)
        t1_indices = np.where(mask1)[0]
        if len(t1_indices) > 0:
            f1 = np.linspace(f1_start, f1_end, len(t1_indices))
            for i, (t_idx, freq) in enumerate(zip(t1_indices, f1)):
                f_idx = np.argmin(np.abs(freqs - freq))
                spectrogram[max(0, f_idx-2):min(n_freqs, f_idx+3), t_idx] += 8.0 * np.exp(-(i - len(t1_indices)/2)**2 / (len(t1_indices)/4)**2)

        # Tonal call 2: Mid-frequency downsweep
        t2_start, t2_end = duration * 0.5, duration * 0.7
        f2_start, f2_end = 3000, 1500
        mask2 = (times >= t2_start) & (times <= t2_end)
        t2_indices = np.where(mask2)[0]
        if len(t2_indices) > 0:
            f2 = np.linspace(f2_start, f2_end, len(t2_indices))
            for i, (t_idx, freq) in enumerate(zip(t2_indices, f2)):
                f_idx = np.argmin(np.abs(freqs - freq))
                spectrogram[max(0, f_idx-3):min(n_freqs, f_idx+4), t_idx] += 6.0

        # Broadband transient (like click or impulsive noise)
        t3_pos = int(n_frames * 0.15)
        if t3_pos < n_frames:
            pulse = np.exp(-((freqs / 8000) ** 2))
            spectrogram[:, t3_pos:min(n_frames, t3_pos+5)] += pulse[:, np.newaxis] * 5.0

        # Constant tonal (like boat)
        boat_freq = 200
        f_boat_idx = np.argmin(np.abs(freqs - boat_freq))
        spectrogram[f_boat_idx:f_boat_idx+2, :] += 4.0

    # Convert to dB scale
    spectrogram_db = 20 * np.log10(np.abs(spectrogram) + 1e-10)

    # Normalize to realistic range
    spectrogram_db = (spectrogram_db - spectrogram_db.mean()) * 15 + 50

    return spectrogram_db, times, freqs


def create_netcdf_file(
    output_path: str,
    begin_time: datetime,
    duration: float = 10.0,
    sample_rate: int = 48000,
    window_size: int = 2048,
    hop_size: int = 512,
):
    """Create a NetCDF spectrogram file"""

    # Generate spectrogram data
    spectrogram, times, freqs = generate_realistic_spectrogram(
        duration=duration,
        sample_rate=sample_rate,
        window_size=window_size,
        hop_size=hop_size,
    )

    # Create xarray Dataset
    ds = xr.Dataset(
        {
            'spectrogram': (['frequency', 'time'], spectrogram),
        },
        coords={
            'time': times,
            'frequency': freqs,
        },
        attrs={
            'begin': begin_time.isoformat(),
            'end': (begin_time + timedelta(seconds=duration)).isoformat(),
            'sample_rate': float(sample_rate),
            'window_size': int(window_size),
            'hop_size': int(hop_size),
            'nfft': int(window_size),
            'db_ref': 1.0,
            'duration': float(duration),
        }
    )

    # Save to NetCDF
    ds.to_netcdf(output_path, format='NETCDF4')
    print(f"Created: {output_path}")

    return ds


def update_datasets_csv(base_path: str, dataset_name: str):
    """Update the datasets.csv file with the new dataset entry"""

    csv_path = Path(base_path) / "datasets.csv"

    # Create CSV if it doesn't exist
    if not csv_path.exists():
        with open(csv_path, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['path', 'dataset', 'spectro_duration', 'dataset_sr', 'file_type', 'identifier'])
        print(f"Created: {csv_path}")

    # Read existing entries
    existing_entries = []
    entry_exists = False

    with open(csv_path, 'r', newline='') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row['dataset'] == dataset_name and row['path'] == dataset_name:
                # Update existing entry
                row['spectro_duration'] = '10'
                row['dataset_sr'] = '48000'
                row['file_type'] = '.nc'
                row['identifier'] = 'netcdf'
                entry_exists = True
            existing_entries.append(row)

    # Add new entry if it doesn't exist
    if not entry_exists:
        existing_entries.append({
            'path': dataset_name,
            'dataset': dataset_name,
            'spectro_duration': '10',
            'dataset_sr': '48000',
            'file_type': '.nc',
            'identifier': 'netcdf'
        })

    # Write back to CSV
    with open(csv_path, 'w', newline='') as f:
        fieldnames = ['path', 'dataset', 'spectro_duration', 'dataset_sr', 'file_type', 'identifier']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(existing_entries)

    print(f"Updated: {csv_path}")


def create_dataset_structure(base_path: str, dataset_name: str = "netcdf_example"):
    """Create the complete dataset structure with JSON files and NetCDF spectrograms"""

    dataset_path = Path(base_path) / dataset_name
    dataset_path.mkdir(parents=True, exist_ok=True)

    # Configuration
    duration = 10  # seconds
    sample_rate = 48000
    window_size = 2048
    hop_size = 512
    nfft = 2048
    overlap = window_size - hop_size

    # Create subdirectories for both OSEkit and legacy formats
    # OSEkit format
    audio_path = dataset_path / "data" / "audio" / "original"
    spectro_path = dataset_path / "processed" / "netcdf_analysis" / "spectrogram"
    audio_path.mkdir(parents=True, exist_ok=True)
    spectro_path.mkdir(parents=True, exist_ok=True)

    # Legacy format
    legacy_audio_path = dataset_path / "data" / "audio" / f"{duration}_{sample_rate}"
    legacy_spectro_path = dataset_path / "processed" / "spectrogram" / f"{duration}_{sample_rate}" / f"{nfft}_{window_size}_{overlap}_linear"
    legacy_spectro_image_path = legacy_spectro_path / "image"
    legacy_audio_path.mkdir(parents=True, exist_ok=True)
    legacy_spectro_image_path.mkdir(parents=True, exist_ok=True)

    # Generate 5 spectrograms
    base_time = datetime(2024, 1, 1, 0, 0, 0)
    spectro_files = []
    spectro_data_dict = {}
    timestamp_entries = []

    for i in range(5):
        begin_time = base_time + timedelta(hours=i*2)
        filename = begin_time.strftime("%Y_%m_%d_%H_%M_%S_%f")

        # Create NetCDF file in OSEkit location
        nc_file = spectro_path / f"{filename}.nc"
        create_netcdf_file(
            str(nc_file),
            begin_time,
            duration=duration,
            sample_rate=sample_rate,
            window_size=window_size,
            hop_size=hop_size,
        )

        # Also create in legacy location
        legacy_nc_file = legacy_spectro_image_path / f"{filename}.nc"
        create_netcdf_file(
            str(legacy_nc_file),
            begin_time,
            duration=duration,
            sample_rate=sample_rate,
            window_size=window_size,
            hop_size=hop_size,
        )

        spectro_files.append(filename)

        # Add timestamp entry
        timestamp_entries.append({
            'filename': f"{filename}.wav",  # Reference to audio file
            'timestamp': begin_time.isoformat()
        })

        # Build spectro data entry
        end_time = begin_time + timedelta(seconds=10)
        spectro_data_dict[filename] = {
            "audio_data": {
                "begin": begin_time.isoformat() + "+0000",
                "end": end_time.isoformat() + "+0000",
                "files": {},
                "instrument": {
                    "end_to_end_db": 150.0,
                    "gain_db": 0.0,
                    "peak_voltage": 1.0,
                    "sensitivity": 1.0
                },
                "normalization": 1,
                "normalization_values": {
                    "mean": None,
                    "peak": None,
                    "std": None
                },
                "sample_rate": 48000
            },
            "begin": begin_time.isoformat() + "+0000",
            "colormap": "viridis",
            "end": end_time.isoformat() + "+0000",
            "files": {},
            "sft": None,
            "v_lim": [0.0, 100.0]
        }

    # Create analysis JSON
    analysis_json = {
        "data": spectro_data_dict,
        "folder": str(dataset_path / "processed" / "netcdf_analysis"),
        "name": "netcdf_analysis",
        "scale": None,
        "sft": None,
        "suffix": ""
    }

    analysis_json_path = dataset_path / "processed" / "netcdf_analysis" / "netcdf_analysis.json"
    with open(analysis_json_path, 'w') as f:
        json.dump(analysis_json, f, indent=2)
    print(f"Created: {analysis_json_path}")

    # Create audio dataset JSON
    audio_json = {
        "files": {},
        "folder": str(audio_path),
        "instrument": {
            "end_to_end_db": 150.0,
            "gain_db": 0.0,
            "peak_voltage": 1.0,
            "sensitivity": 1.0
        },
        "name": "original"
    }

    audio_json_path = audio_path / "original.json"
    with open(audio_json_path, 'w') as f:
        json.dump(audio_json, f, indent=2)
    print(f"Created: {audio_json_path}")

    # Create main dataset JSON
    dataset_json = {
        "datasets": {
            "netcdf_analysis": {
                "class": "SpectroDataset",
                "analysis": "netcdf_analysis",
                "json": str(analysis_json_path)
            },
            "original": {
                "class": "AudioDataset",
                "analysis": "original",
                "json": str(audio_json_path)
            }
        },
        "depth": 100,
        "folder": str(dataset_path),
        "gps_coordinates": [60.39, 5.32],
        "instrument": {
            "end_to_end_db": 150.0,
            "gain_db": 0.0,
            "peak_voltage": 1.0,
            "sensitivity": 1.0
        },
        "strptime_format": "%Y_%m_%d_%H_%M_%S_%f",
        "timezone": "UTC"
    }

    dataset_json_path = dataset_path / "dataset.json"
    with open(dataset_json_path, 'w') as f:
        json.dump(dataset_json, f, indent=2)
    print(f"Created: {dataset_json_path}")

    # Create legacy CSV files
    # Audio metadata.csv
    audio_metadata_csv = legacy_audio_path / "metadata.csv"
    with open(audio_metadata_csv, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=[
            'sample_bits', 'channel_count', 'start_date', 'end_date',
            'dataset_sr', 'audio_file_dataset_duration', 'audio_file_count'
        ])
        writer.writeheader()
        writer.writerow({
            'sample_bits': "['PCM-16']",
            'channel_count': 1,
            'start_date': base_time.isoformat(),
            'end_date': (base_time + timedelta(hours=10)).isoformat(),
            'dataset_sr': sample_rate,
            'audio_file_dataset_duration': duration,
            'audio_file_count': len(spectro_files)
        })
    print(f"Created: {audio_metadata_csv}")

    # Audio timestamp.csv
    audio_timestamp_csv = legacy_audio_path / "timestamp.csv"
    with open(audio_timestamp_csv, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=['filename', 'timestamp'])
        writer.writeheader()
        writer.writerows(timestamp_entries)
    print(f"Created: {audio_timestamp_csv}")

    # Spectrogram metadata.csv
    spectro_metadata_csv = legacy_spectro_path / "metadata.csv"
    freq_resolution = sample_rate / nfft
    temporal_resolution = hop_size / sample_rate
    with open(spectro_metadata_csv, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=[
            'dataset_sr', 'nfft', 'window_size', 'overlap', 'colormap',
            'zoom_level', 'dynamic_min', 'dynamic_max', 'spectro_duration',
            'data_normalization', 'hp_filter_min_freq', 'sensitivity_dB',
            'peak_voltage', 'spectro_normalization', 'gain_dB',
            'zscore_duration', 'window_type', 'frequency_resolution',
            'temporal_resolution', 'audio_file_dataset_overlap',
            'custom_frequency_scale'
        ])
        writer.writeheader()
        writer.writerow({
            'dataset_sr': sample_rate,
            'nfft': nfft,
            'window_size': window_size,
            'overlap': overlap,
            'colormap': 'viridis',
            'zoom_level': 1,
            'dynamic_min': 0,
            'dynamic_max': 100,
            'spectro_duration': duration,
            'data_normalization': 'instrument',
            'hp_filter_min_freq': 0,
            'sensitivity_dB': 0.0,
            'peak_voltage': 1.0,
            'spectro_normalization': 'density',
            'gain_dB': 0,
            'zscore_duration': '',
            'window_type': 'hann',
            'frequency_resolution': freq_resolution,
            'temporal_resolution': temporal_resolution,
            'audio_file_dataset_overlap': 0,
            'custom_frequency_scale': 'linear'
        })
    print(f"Created: {spectro_metadata_csv}")

    # Update datasets.csv in the parent directory
    update_datasets_csv(base_path, dataset_name)

    print(f"\n✓ Dataset created successfully at: {dataset_path}")
    print(f"✓ Generated {len(spectro_files)} NetCDF spectrograms (in both OSEkit and legacy locations)")
    print(f"✓ Created all required CSV metadata files (audio and spectrogram)")
    print(f"✓ Updated datasets.csv with entry for '{dataset_name}'")
    print(f"\nDataset structure:")
    print(f"  - OSEkit format: dataset.json + processed/netcdf_analysis/")
    print(f"  - Legacy format: data/audio/{duration}_{sample_rate}/ + processed/spectrogram/")
    print(f"\nTo import this dataset into APLOSE:")
    print(f"1. The dataset is ready at: {dataset_path}")
    print(f"2. If generated in volumes/datawork/dataset/, it's already accessible to Docker")
    print(f"3. Use the APLOSE web interface to import the dataset")
    print(f"   - You can import as legacy format (uses CSV files)")
    print(f"   - Or as OSEkit format (uses JSON files)")
    print(f"4. The NetCDF spectrograms will be automatically detected and displayed")

    return dataset_path


def main():
    parser = argparse.ArgumentParser(
        description="Generate example NetCDF spectrogram dataset for APLOSE"
    )
    parser.add_argument(
        "--output",
        type=str,
        default="./example_datasets",
        help="Output directory for the dataset (default: ./example_datasets)"
    )
    parser.add_argument(
        "--name",
        type=str,
        default="netcdf_example",
        help="Dataset name (default: netcdf_example)"
    )

    args = parser.parse_args()

    print("=" * 60)
    print("APLOSE NetCDF Example Dataset Generator")
    print("=" * 60)
    print()

    create_dataset_structure(args.output, args.name)

    print("\n" + "=" * 60)


if __name__ == "__main__":
    main()
