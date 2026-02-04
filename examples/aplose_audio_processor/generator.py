"""
Main generator class for creating APLOSE-compatible NetCDF files from audio.
"""

import json
import math
import os
import sys
from pathlib import Path
from typing import Optional, Union, List, Dict
from datetime import datetime
import numpy as np
import xarray as xr
from scipy import signal
import soundfile as sf

from .audio_processor import AudioProcessor


# Available colormaps for PNG export
PNG_COLORMAPS = ['viridis', 'plasma', 'inferno', 'magma', 'hot', 'jet', 'gray']


class AploseAudioProcessor:
    """
    Generate APLOSE-compatible NetCDF spectrogram files from audio files.

    Supports:
    - Audio resampling
    - Audio snippet generation
    - Single-FFT and multi-FFT spectrograms
    - PNG spectrogram image export
    - Batch processing of folders
    """

    def __init__(
        self,
        fft_sizes: Union[int, List[int]] = 2048,
        window: str = 'hann',
        hop_length_factor: float = 0.25,
        db_ref: float = 1.0,
        db_fullscale: Optional[float] = None,
        normalize_audio: bool = False,
        compression_level: int = 4,
        datetime_format: str = "%Y_%m_%d_%H_%M_%S",
        target_sample_rate: Optional[int] = None,
        snippet_duration: Optional[float] = None,
        snippet_overlap: float = 0.0,
        filename_prefix: Optional[str] = None,
        generate_png: bool = False,
        png_colormap: str = 'viridis',
        png_dpi: int = 100,
        png_log_frequency: bool = True,
        generate_data_png: bool = False
    ):
        """
        Initialize the APLOSE audio processor.

        Args:
            fft_sizes: FFT size(s). Can be a single int or list of ints for multi-FFT.
            window: Window function ('hann', 'hamming', 'blackman').
            hop_length_factor: Hop length as fraction of FFT size (default: 0.25).
            db_ref: Reference value for dB conversion (default: 1.0). Ignored if db_fullscale is set.
            db_fullscale: dB re 1 µPa value corresponding to digital full scale (max WAV value).
                         When set, output is calibrated to dB re 1 µPa. Takes precedence over db_ref.
            normalize_audio: If True, normalize audio to [-1, 1] before computing spectrogram.
            compression_level: zlib compression level 0-9 (0=none, 9=max). Default 4.
            datetime_format: strptime format to parse datetime from filenames.
            target_sample_rate: Target sample rate for resampling. None = keep original.
            snippet_duration: Duration in seconds for audio snippets. None = no splitting.
            snippet_overlap: Overlap between snippets in seconds (default: 0.0).
            filename_prefix: Optional prefix to add to all output filenames.
            generate_png: If True, also generate visual PNG spectrogram images.
            png_colormap: Colormap for visual PNG images ('viridis', 'plasma', 'hot', 'jet', etc.).
            png_dpi: DPI for visual PNG images (default: 100).
            png_log_frequency: If True (default), render visual PNG with log frequency axis.
            generate_data_png: If True, generate data PNG + JSON for Plotly display.
                              This is a compact format that allows interactive visualization.
        """
        # Handle single or multiple FFT sizes
        if isinstance(fft_sizes, int):
            self.fft_sizes = [fft_sizes]
        else:
            self.fft_sizes = sorted(fft_sizes)

        self.window = window
        self.hop_length_factor = hop_length_factor
        self.db_ref = db_ref
        self.db_fullscale = db_fullscale
        self.normalize_audio = normalize_audio
        self.compression_level = compression_level
        self.datetime_format = datetime_format
        self.generate_png = generate_png
        self.png_colormap = png_colormap
        self.png_dpi = png_dpi
        self.png_log_frequency = png_log_frequency
        self.generate_data_png = generate_data_png

        # Initialize audio processor
        self.audio_processor = AudioProcessor(
            target_sample_rate=target_sample_rate,
            snippet_duration=snippet_duration,
            overlap=snippet_overlap,
            filename_prefix=filename_prefix
        )

    def process_folder(
        self,
        input_folder: str,
        output_folder: str,
        audio_extensions: List[str] = None,
        preserve_timestamps: bool = True,
        datetime_format: Optional[str] = None
    ) -> Dict[str, List[str]]:
        """
        Process all audio files in a folder.

        Args:
            input_folder: Path to folder containing audio files.
            output_folder: Path to output folder for WAV and NetCDF files.
            audio_extensions: List of audio file extensions to process (default: ['.wav', '.WAV']).
            preserve_timestamps: Preserve timestamps in snippet filenames.
            datetime_format: Optional datetime format override for parsing filenames.
                           If not provided, uses the instance's datetime_format.

        Returns:
            Dictionary with 'wav_files' and 'netcdf_files' lists.
        """
        if audio_extensions is None:
            audio_extensions = ['.wav', '.WAV']

        input_path = Path(input_folder)
        output_path = Path(output_folder)

        # Create output directory
        output_path.mkdir(parents=True, exist_ok=True)

        # Find all audio files
        audio_files = []
        for ext in audio_extensions:
            audio_files.extend(input_path.glob(f'*{ext}'))

        if not audio_files:
            print(f"No audio files found in {input_folder}")
            return {'wav_files': [], 'netcdf_files': [], 'png_files': []}

        print(f"Found {len(audio_files)} audio file(s) to process")

        # Temporarily override datetime_format if provided
        original_datetime_format = self.datetime_format
        if datetime_format is not None:
            self.datetime_format = datetime_format

        all_wav_files = []
        all_netcdf_files = []
        all_png_files = []

        for audio_file in sorted(audio_files):
            print(f"\nProcessing: {audio_file.name}")

            # Process audio (resample and/or create snippets)
            wav_results = self.audio_processor.process_audio_file(
                str(audio_file),
                str(output_path),
                preserve_timestamps=preserve_timestamps
            )

            print(f"  Generated {len(wav_results)} audio file(s)")

            # Generate NetCDF for each processed audio file
            for wav_path, metadata in wav_results:
                print(f"  Creating spectrogram for: {Path(wav_path).name}")

                if len(self.fft_sizes) == 1:
                    # Single FFT
                    netcdf_path = self._create_single_fft_netcdf(
                        wav_path, metadata, return_data=False
                    )
                else:
                    # Multi-FFT
                    netcdf_path = self._create_multi_fft_netcdf(
                        wav_path, metadata, return_data=False
                    )

                all_wav_files.append(wav_path)
                all_netcdf_files.append(netcdf_path)

                # Generate visual PNGs for all FFT sizes if enabled
                if self.generate_png:
                    png_paths = self._create_pngs_for_all_fft_sizes(wav_path)
                    all_png_files.extend(png_paths)
                    for png_path in png_paths:
                        print(f"    Created PNG: {Path(png_path).name}")

                # Generate data PNGs + JSON for Plotly display if enabled
                if self.generate_data_png:
                    data_png_results = self._create_data_pngs_for_all_fft_sizes(wav_path, metadata)
                    for png_path, json_path in data_png_results:
                        all_png_files.append(png_path)
                        print(f"    Created data PNG: {Path(png_path).name}")
                        print(f"    Created metadata: {Path(json_path).name}")

        # Restore original datetime_format
        self.datetime_format = original_datetime_format

        print(f"\nProcessing complete!")
        print(f"Generated {len(all_wav_files)} WAV files")
        print(f"Generated {len(all_netcdf_files)} NetCDF files")
        if self.generate_png or self.generate_data_png:
            print(f"Generated {len(all_png_files)} PNG files")

        return {
            'wav_files': all_wav_files,
            'netcdf_files': all_netcdf_files,
            'png_files': all_png_files
        }

    def process_single_file(
        self,
        input_file: str,
        output_folder: str,
        preserve_timestamps: bool = True,
        datetime_format: Optional[str] = None
    ) -> Dict[str, List[str]]:
        """
        Process a single audio file.

        Args:
            input_file: Path to audio file.
            output_folder: Path to output folder.
            preserve_timestamps: Preserve timestamps in snippet filenames.
            datetime_format: Optional datetime format override for parsing filenames.
                           If not provided, uses the instance's datetime_format.

        Returns:
            Dictionary with 'wav_files' and 'netcdf_files' lists.
        """
        output_path = Path(output_folder)
        output_path.mkdir(parents=True, exist_ok=True)

        print(f"Processing: {input_file}")

        # Temporarily override datetime_format if provided
        original_datetime_format = self.datetime_format
        if datetime_format is not None:
            self.datetime_format = datetime_format

        # Process audio
        wav_results = self.audio_processor.process_audio_file(
            input_file,
            str(output_path),
            preserve_timestamps=preserve_timestamps
        )

        print(f"Generated {len(wav_results)} audio file(s)")

        all_wav_files = []
        all_netcdf_files = []
        all_png_files = []

        # Generate NetCDF for each processed audio file
        for wav_path, metadata in wav_results:
            print(f"Creating spectrogram for: {Path(wav_path).name}")

            if len(self.fft_sizes) == 1:
                netcdf_path = self._create_single_fft_netcdf(
                    wav_path, metadata, return_data=False
                )
            else:
                netcdf_path = self._create_multi_fft_netcdf(
                    wav_path, metadata, return_data=False
                )

            all_wav_files.append(wav_path)
            all_netcdf_files.append(netcdf_path)

            # Generate visual PNGs for all FFT sizes if enabled
            if self.generate_png:
                png_paths = self._create_pngs_for_all_fft_sizes(wav_path)
                all_png_files.extend(png_paths)
                for png_path in png_paths:
                    print(f"  Created PNG: {Path(png_path).name}")

            # Generate data PNGs + JSON for Plotly display if enabled
            if self.generate_data_png:
                data_png_results = self._create_data_pngs_for_all_fft_sizes(wav_path, metadata)
                for png_path, json_path in data_png_results:
                    all_png_files.append(png_path)
                    print(f"  Created data PNG: {Path(png_path).name}")
                    print(f"  Created metadata: {Path(json_path).name}")

        # Restore original datetime_format
        self.datetime_format = original_datetime_format

        print(f"\nProcessing complete!")
        print(f"Generated {len(all_wav_files)} WAV files")
        print(f"Generated {len(all_netcdf_files)} NetCDF files")
        if self.generate_png or self.generate_data_png:
            print(f"Generated {len(all_png_files)} PNG files")

        return {
            'wav_files': all_wav_files,
            'netcdf_files': all_netcdf_files,
            'png_files': all_png_files
        }

    def _create_single_fft_netcdf(
        self,
        wav_path: str,
        metadata: dict,
        return_data: bool = False
    ) -> Union[str, tuple]:
        """
        Create a single-FFT NetCDF file.

        Args:
            wav_path: Path to WAV file.
            metadata: Metadata dictionary from audio processing.
            return_data: If True, also return spectrogram data for PNG generation.

        Returns:
            Path to created NetCDF file, or tuple of (path, spec_data, freqs, times).
        """
        nfft = self.fft_sizes[0]
        hop_length = int(nfft * self.hop_length_factor)

        # Read audio
        audio, sample_rate = sf.read(wav_path)

        # Calculate spectrogram
        spec_data, freqs, times = self._calculate_spectrogram(
            audio, sample_rate, nfft, hop_length
        )

        # Parse datetime from filename
        wav_filename = Path(wav_path).stem
        begin_dt, end_dt = self._parse_datetime(
            wav_filename,
            metadata['duration']
        )

        # Create xarray Dataset
        ds = xr.Dataset(
            data_vars={
                'spectrogram': (('frequency', 'time'), spec_data)
            },
            coords={
                'frequency': freqs,
                'time': times
            },
            attrs=self._build_netcdf_attrs(
                begin_dt, end_dt, sample_rate, nfft, hop_length,
                metadata['duration'], Path(wav_path).name
            )
        )

        # Save NetCDF with float32 encoding and compression
        netcdf_path = str(Path(wav_path).with_suffix('.nc'))
        encoding = {'spectrogram': {
            'dtype': 'float32',
            'zlib': self.compression_level > 0,
            'complevel': self.compression_level
        }}
        ds.to_netcdf(netcdf_path, encoding=encoding)

        if return_data:
            return netcdf_path, spec_data, freqs, times
        return netcdf_path

    def _create_multi_fft_netcdf(
        self,
        wav_path: str,
        metadata: dict,
        return_data: bool = False
    ) -> Union[str, tuple]:
        """
        Create a multi-FFT NetCDF file.

        Args:
            wav_path: Path to WAV file.
            metadata: Metadata dictionary from audio processing.
            return_data: If True, also return spectrogram data for PNG generation.

        Returns:
            Path to created NetCDF file, or tuple of (path, spec_data, freqs, times).
        """
        # Read audio once
        audio, sample_rate = sf.read(wav_path)

        # Parse datetime from filename
        wav_filename = Path(wav_path).stem
        begin_dt, end_dt = self._parse_datetime(
            wav_filename,
            metadata['duration']
        )

        # Calculate spectrograms for each FFT size
        data_vars = {}
        coords = {}
        first_spec_data = None
        first_freqs = None
        first_times = None

        for i, nfft in enumerate(self.fft_sizes):
            hop_length = int(nfft * self.hop_length_factor)

            # Calculate spectrogram
            spec_data, freqs, times = self._calculate_spectrogram(
                audio, sample_rate, nfft, hop_length
            )

            # Store first spectrogram for PNG (use smallest FFT for best time resolution)
            if i == 0:
                first_spec_data = spec_data
                first_freqs = freqs
                first_times = times

            # Add to dataset with FFT-specific naming
            var_name = f'spectrogram_fft{nfft}'
            freq_name = f'frequency_fft{nfft}'
            time_name = f'time_fft{nfft}'

            data_vars[var_name] = ((freq_name, time_name), spec_data)
            coords[freq_name] = freqs
            coords[time_name] = times

        # Create xarray Dataset
        ds = xr.Dataset(
            data_vars=data_vars,
            coords=coords,
            attrs=self._build_netcdf_attrs(
                begin_dt, end_dt, sample_rate, None, None,
                metadata['duration'], Path(wav_path).name,
                fft_sizes_str=','.join(map(str, self.fft_sizes))
            )
        )

        # Save NetCDF with float32 encoding and compression for all spectrogram variables
        netcdf_path = str(Path(wav_path).with_suffix('.nc'))
        encoding = {var_name: {
            'dtype': 'float32',
            'zlib': self.compression_level > 0,
            'complevel': self.compression_level
        } for var_name in data_vars.keys()}
        ds.to_netcdf(netcdf_path, encoding=encoding)

        if return_data:
            return netcdf_path, first_spec_data, first_freqs, first_times
        return netcdf_path

    def _build_netcdf_attrs(
        self,
        begin_dt: datetime,
        end_dt: datetime,
        sample_rate: int,
        nfft: Optional[int],
        hop_length: Optional[int],
        duration: float,
        audio_file: str,
        fft_sizes_str: Optional[str] = None
    ) -> dict:
        """
        Build attributes dictionary for NetCDF file.

        Args:
            begin_dt: Begin datetime.
            end_dt: End datetime.
            sample_rate: Sample rate.
            nfft: FFT size (single-FFT mode) or None (multi-FFT mode).
            hop_length: Hop length (single-FFT mode) or None (multi-FFT mode).
            duration: Audio duration in seconds.
            audio_file: Audio filename.
            fft_sizes_str: Comma-separated FFT sizes string (multi-FFT mode).

        Returns:
            Attributes dictionary.
        """
        attrs = {
            'begin': begin_dt.isoformat(),
            'end': end_dt.isoformat(),
            'sample_rate': float(sample_rate),
            'window': self.window,
            'duration': int(math.ceil(duration)),  # Ceil to allow annotations at full duration
            'audio_file': audio_file,
            'normalize_audio': int(self.normalize_audio),  # NetCDF doesn't support bool
        }

        # Single-FFT mode
        if nfft is not None:
            attrs['nfft'] = int(nfft)
        if hop_length is not None:
            attrs['hop_length'] = int(hop_length)

        # Multi-FFT mode
        if fft_sizes_str is not None:
            attrs['fft_sizes'] = fft_sizes_str

        # dB reference: prefer db_fullscale over db_ref
        if self.db_fullscale is not None:
            attrs['db_fullscale'] = float(self.db_fullscale)
        else:
            attrs['db_ref'] = float(self.db_ref)

        return attrs

    def _create_png(
        self,
        wav_path: str,
        spec_data: np.ndarray,
        freqs: np.ndarray,
        times: np.ndarray,
        nfft: Optional[int] = None
    ) -> str:
        """
        Create a PNG spectrogram image.

        Args:
            wav_path: Path to WAV file (used to derive PNG filename).
            spec_data: Spectrogram data array (frequency x time).
            freqs: Frequency array.
            times: Time array.
            nfft: FFT size (used for naming when multiple FFT sizes).

        Returns:
            Path to created PNG file.
        """
        try:
            import matplotlib
            matplotlib.use('Agg')  # Non-interactive backend
            import matplotlib.pyplot as plt
            from matplotlib.colors import LogNorm
        except ImportError:
            raise ImportError(
                "matplotlib is required for PNG export. "
                "Install it with: pip install matplotlib"
            )

        # Create figure
        fig, ax = plt.subplots(figsize=(12, 4), dpi=self.png_dpi)

        # Calculate vmin/vmax for color scaling (use percentiles for robustness)
        vmin = np.percentile(spec_data, 5)
        vmax = np.percentile(spec_data, 95)

        # For log frequency axis, we need to handle the frequency grid differently
        if self.png_log_frequency:
            # Use log scale on y-axis
            # Filter out zero/negative frequencies for log scale
            valid_freq_mask = freqs > 0
            freqs_valid = freqs[valid_freq_mask]
            spec_data_valid = spec_data[valid_freq_mask, :]

            # Plot spectrogram with log y-axis
            img = ax.pcolormesh(
                times, freqs_valid, spec_data_valid,
                shading='auto',
                cmap=self.png_colormap,
                vmin=vmin,
                vmax=vmax
            )

            # Set log scale on y-axis
            ax.set_yscale('log')
            ax.set_ylim(max(freqs_valid[0], 1), freqs_valid[-1])
        else:
            # Linear frequency axis
            img = ax.pcolormesh(
                times, freqs, spec_data,
                shading='auto',
                cmap=self.png_colormap,
                vmin=vmin,
                vmax=vmax
            )
            ax.set_ylim(freqs[0], freqs[-1])

        # Style the plot
        ax.set_xlabel('Time (s)', color='white')
        ax.set_ylabel('Frequency (Hz)', color='white')
        ax.tick_params(colors='white')
        ax.set_facecolor('black')

        # Add colorbar
        cbar = plt.colorbar(img, ax=ax, pad=0.01)
        cbar.set_label('dB', color='white')
        cbar.ax.yaxis.set_tick_params(color='white')
        plt.setp(plt.getp(cbar.ax.axes, 'yticklabels'), color='white')

        # Set figure background to black
        fig.patch.set_facecolor('black')

        # Tight layout
        plt.tight_layout()

        # Generate filename - include FFT size if provided
        wav_stem = Path(wav_path).stem
        if nfft is not None:
            png_filename = f"{wav_stem}_fft{nfft}.png"
        else:
            png_filename = f"{wav_stem}.png"
        png_path = str(Path(wav_path).parent / png_filename)

        plt.savefig(png_path, dpi=self.png_dpi, bbox_inches='tight',
                    facecolor='black', edgecolor='none')
        plt.close(fig)

        return png_path

    def _create_data_png_with_metadata(
        self,
        wav_path: str,
        spec_data: np.ndarray,
        freqs: np.ndarray,
        times: np.ndarray,
        sample_rate: int,
        nfft: int,
        hop_length: int,
        metadata: dict
    ) -> tuple:
        """
        Create a data PNG (grayscale, no axes) with JSON metadata for Plotly display.

        The PNG stores normalized spectrogram values as 16-bit grayscale pixels.
        The JSON contains metadata needed to reconstruct actual dB values.

        Args:
            wav_path: Path to WAV file (used to derive filenames).
            spec_data: Spectrogram data array (frequency x time) in dB.
            freqs: Frequency array in Hz.
            times: Time array in seconds.
            sample_rate: Audio sample rate.
            nfft: FFT size used.
            hop_length: Hop length used.
            metadata: Additional metadata from audio processing.

        Returns:
            Tuple of (png_path, json_path).
        """
        from PIL import Image

        # Get data range for normalization
        db_min = float(np.min(spec_data))
        db_max = float(np.max(spec_data))
        db_range = db_max - db_min

        # Normalize to 0-65535 for 16-bit PNG
        if db_range > 0:
            normalized = ((spec_data - db_min) / db_range * 65535).astype(np.uint16)
        else:
            normalized = np.zeros_like(spec_data, dtype=np.uint16)

        # Create 16-bit grayscale image
        # Note: spec_data is (frequency, time), image should be (height, width)
        # Flip vertically so low frequencies are at bottom
        img_data = np.flipud(normalized)
        img = Image.fromarray(img_data, mode='I;16')

        # Generate filenames
        wav_stem = Path(wav_path).stem
        png_filename = f"{wav_stem}_fft{nfft}_data.png"
        json_filename = f"{wav_stem}_fft{nfft}_data.json"
        png_path = str(Path(wav_path).parent / png_filename)
        json_path = str(Path(wav_path).parent / json_filename)

        # Save PNG
        img.save(png_path)

        # Parse datetime
        begin_dt, end_dt = self._parse_datetime(wav_stem, metadata['duration'])

        # Build JSON metadata
        json_data = {
            'format_version': 1,
            'png_file': png_filename,
            'encoding': {
                'bit_depth': 16,
                'db_min': db_min,
                'db_max': db_max,
                'description': 'Pixel value 0 = db_min, 65535 = db_max'
            },
            'spectrogram': {
                'shape': list(spec_data.shape),  # [n_frequencies, n_times]
                'frequency_min': float(freqs[0]),
                'frequency_max': float(freqs[-1]),
                'time_min': float(times[0]),
                'time_max': float(times[-1]),
                'n_frequencies': len(freqs),
                'n_times': len(times)
            },
            'audio': {
                'sample_rate': sample_rate,
                'duration': float(metadata['duration']),
                'filename': Path(wav_path).name
            },
            'analysis': {
                'nfft': nfft,
                'hop_length': hop_length,
                'window': self.window,
                'normalize_audio': self.normalize_audio
            },
            'calibration': {
                'db_fullscale': self.db_fullscale,
                'db_ref': self.db_ref if self.db_fullscale is None else None
            },
            'temporal': {
                'begin': begin_dt.isoformat(),
                'end': end_dt.isoformat()
            }
        }

        # Save JSON
        with open(json_path, 'w') as f:
            json.dump(json_data, f, indent=2)

        return png_path, json_path

    def _create_data_pngs_for_all_fft_sizes(
        self,
        wav_path: str,
        metadata: dict
    ) -> List[tuple]:
        """
        Create data PNG + JSON files for all FFT sizes.

        Args:
            wav_path: Path to WAV file.
            metadata: Metadata from audio processing.

        Returns:
            List of (png_path, json_path) tuples.
        """
        # Read audio once
        audio, sample_rate = sf.read(wav_path)

        results = []

        for nfft in self.fft_sizes:
            hop_length = int(nfft * self.hop_length_factor)

            # Calculate spectrogram
            spec_data, freqs, times = self._calculate_spectrogram(
                audio, sample_rate, nfft, hop_length
            )

            # Create data PNG with metadata
            png_path, json_path = self._create_data_png_with_metadata(
                wav_path, spec_data, freqs, times,
                sample_rate, nfft, hop_length, metadata
            )
            results.append((png_path, json_path))

        return results

    def _create_pngs_for_all_fft_sizes(
        self,
        wav_path: str
    ) -> List[str]:
        """
        Create PNG spectrogram images for all FFT sizes.

        Args:
            wav_path: Path to WAV file.

        Returns:
            List of paths to created PNG files.
        """
        # Read audio once
        audio, sample_rate = sf.read(wav_path)

        png_paths = []

        for nfft in self.fft_sizes:
            hop_length = int(nfft * self.hop_length_factor)

            # Calculate spectrogram
            spec_data, freqs, times = self._calculate_spectrogram(
                audio, sample_rate, nfft, hop_length
            )

            # Create PNG with FFT size in filename
            png_path = self._create_png(wav_path, spec_data, freqs, times, nfft=nfft)
            png_paths.append(png_path)

        return png_paths

    def _calculate_spectrogram(
        self,
        audio: np.ndarray,
        sample_rate: int,
        nfft: int,
        hop_length: int
    ) -> tuple:
        """
        Calculate spectrogram using STFT.

        Args:
            audio: Audio data.
            sample_rate: Sample rate.
            nfft: FFT size.
            hop_length: Hop length.

        Returns:
            Tuple of (spectrogram_db, frequencies, times).
        """
        # Normalize audio if requested
        if self.normalize_audio:
            max_val = np.max(np.abs(audio))
            if max_val > 0:
                audio = audio / max_val

        # Get window function
        if self.window == 'hann':
            window_func = signal.windows.hann(nfft)
        elif self.window == 'hamming':
            window_func = signal.windows.hamming(nfft)
        elif self.window == 'blackman':
            window_func = signal.windows.blackman(nfft)
        else:
            raise ValueError(f"Unsupported window function: {self.window}")

        # Calculate STFT
        freqs, times, stft = signal.stft(
            audio,
            fs=sample_rate,
            window=window_func,
            nperseg=nfft,
            noverlap=nfft - hop_length,
            return_onesided=True
        )

        # Convert to power spectrogram
        spec_power = np.abs(stft) ** 2

        # Convert to dB scale
        if self.db_fullscale is not None:
            # db_fullscale: dB re 1 µPa value of digital full scale (1.0)
            # Output will be in dB re 1 µPa
            spec_db = 10 * np.log10(spec_power + 1e-10) + self.db_fullscale
        else:
            # Legacy mode: use db_ref as reference value
            spec_db = 10 * np.log10(spec_power / self.db_ref + 1e-10)

        return spec_db, freqs, times

    def _parse_datetime(
        self,
        filename: str,
        duration: float
    ) -> tuple:
        """
        Parse datetime from filename.

        Args:
            filename: Filename without extension.
            duration: Duration of audio in seconds.

        Returns:
            Tuple of (begin_datetime, end_datetime).
        """
        # Try to parse datetime from filename
        try:
            # Try different positions in the filename
            parts = filename.split('_')
            parsed_dt = None

            # Try to parse the entire filename first
            try:
                parsed_dt = datetime.strptime(filename, self.datetime_format)
            except ValueError:
                # Try to find datetime pattern in parts
                for i in range(len(parts)):
                    for j in range(i+1, min(i+7, len(parts)+1)):
                        candidate = '_'.join(parts[i:j])
                        try:
                            parsed_dt = datetime.strptime(candidate, self.datetime_format)
                            break
                        except ValueError:
                            continue
                    if parsed_dt:
                        break

            if not parsed_dt:
                raise ValueError("Could not parse datetime")

            begin_dt = parsed_dt

        except (ValueError, IndexError):
            # Fallback to current time if parsing fails
            print(f"  Warning: Could not parse datetime from '{filename}', using current time")
            begin_dt = datetime.now()

        # Calculate end datetime
        from datetime import timedelta
        end_dt = begin_dt + timedelta(seconds=duration)

        return begin_dt, end_dt
