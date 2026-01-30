#!/usr/bin/env python3
"""
Generate a simple example NetCDF spectrogram file for demonstration purposes.
This creates a static file that can be included in the Docker image.
"""

import numpy as np
import xarray as xr
from datetime import datetime, timedelta
from pathlib import Path

def generate_example_spectrogram():
    """Generate a simple synthetic spectrogram with some interesting patterns."""

    # Parameters
    duration = 10  # seconds
    sample_rate = 48000
    nfft = 2048
    hop_size = 512

    # Time and frequency arrays
    n_time_bins = int((duration * sample_rate) / hop_size)
    times = np.linspace(0, duration, n_time_bins)
    freqs = np.linspace(0, sample_rate / 2, nfft // 2)

    # Generate synthetic spectrogram data with interesting patterns
    spectrogram = np.zeros((len(freqs), len(times)))

    # Add some noise floor
    spectrogram += np.random.normal(20, 5, spectrogram.shape)

    # Add a horizontal line (constant frequency signal) at ~1000 Hz
    freq_idx_1k = np.argmin(np.abs(freqs - 1000))
    spectrogram[freq_idx_1k-5:freq_idx_1k+5, :] += 30

    # Add a chirp (frequency sweep) from 2kHz to 8kHz
    for i, t in enumerate(times):
        freq = 2000 + (t / duration) * 6000  # Linear sweep
        freq_idx = np.argmin(np.abs(freqs - freq))
        spectrogram[max(0, freq_idx-10):min(len(freqs), freq_idx+10), i] += 40

    # Add some transient pulses at random times
    for pulse_time in [2.5, 5.0, 7.5]:
        time_idx = np.argmin(np.abs(times - pulse_time))
        # Vertical line (broadband pulse)
        spectrogram[100:400, time_idx-3:time_idx+3] += 35

    # Add some whale-like calls (downsweeps)
    for call_time in [1.5, 4.0, 8.5]:
        time_idx = np.argmin(np.abs(times - call_time))
        for dt in range(50):
            if time_idx + dt < len(times):
                freq = 5000 - dt * 50  # Downsweep
                if freq > 0:
                    freq_idx = np.argmin(np.abs(freqs - freq))
                    spectrogram[max(0, freq_idx-8):min(len(freqs), freq_idx+8), time_idx + dt] += 45

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
            'title': 'Example Synthetic Spectrogram',
            'description': 'Synthetic spectrogram with whale-like calls, chirps, and pulses for demonstration',
            'begin': '2024-01-01T12:00:00+0000',
            'end': '2024-01-01T12:00:10+0000',
            'sample_rate': float(sample_rate),
            'window_size': int(nfft),
            'hop_size': int(hop_size),
            'nfft': int(nfft),
            'db_ref': 1.0,
            'created': datetime.now().isoformat(),
        }
    )

    return ds

if __name__ == '__main__':
    # Generate spectrogram
    ds = generate_example_spectrogram()

    # Save to file with float16 encoding
    output_path = Path(__file__).parent / 'example_spectrogram.nc'
    encoding = {'spectrogram': {'dtype': 'float16'}}
    ds.to_netcdf(output_path, encoding=encoding)

    print(f"✓ Created example spectrogram: {output_path}")
    print(f"  Time range: {ds.time.min().values:.2f}s - {ds.time.max().values:.2f}s")
    print(f"  Frequency range: {ds.frequency.min().values:.0f}Hz - {ds.frequency.max().values:.0f}Hz")
    print(f"  Shape: {ds.spectrogram.shape}")
    print(f"  Data range: {ds.spectrogram.min().values:.1f}dB - {ds.spectrogram.max().values:.1f}dB")
