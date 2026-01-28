"""
Spectrogram generator for converting WAV files to NetCDF spectrograms
"""

import numpy as np
import xarray as xr
from pathlib import Path
from datetime import datetime, timedelta
from typing import Optional, Tuple
import re
import logging

logger = logging.getLogger(__name__)

try:
    import soundfile as sf
except ImportError:
    logger.warning("soundfile not installed. Install with: pip install soundfile")
    sf = None


class SpectrogramGenerator:
    """Generate NetCDF spectrograms from WAV files"""

    def __init__(
        self,
        nfft: int = 2048,
        hop_length: int = 512,
        window: str = 'hann',
        ref_db: float = 1.0,
        datetime_format: str = "%Y_%m_%d_%H_%M_%S"
    ):
        """
        Initialize spectrogram generator

        Args:
            nfft: FFT window size
            hop_length: Number of samples between successive frames
            window: Window function ('hann', 'hamming', 'blackman')
            ref_db: Reference value for dB conversion
            datetime_format: strptime format for parsing filenames (default: YYYY_MM_DD_HH_MM_SS)
        """
        self.nfft = nfft
        self.hop_length = hop_length
        self.window = window
        self.ref_db = ref_db
        self.datetime_format = datetime_format

    def parse_datetime_from_filename(self, filename: str) -> Optional[datetime]:
        """
        Extract datetime from filename using the configured format

        Args:
            filename: Filename to parse (e.g., "2024_01_15_08_30_00.wav")

        Returns:
            datetime object or None if parsing fails
        """
        try:
            # Remove file extension
            name_without_ext = Path(filename).stem

            # Try to parse with configured format
            dt = datetime.strptime(name_without_ext, self.datetime_format)
            return dt
        except ValueError as e:
            logger.warning(f"Failed to parse datetime from filename '{filename}': {e}")
            return None

    def wav_to_spectrogram(
        self,
        wav_path: Path,
        output_path: Optional[Path] = None
    ) -> Tuple[xr.Dataset, Optional[Path]]:
        """
        Convert WAV file to NetCDF spectrogram

        Args:
            wav_path: Path to input WAV file
            output_path: Optional path for output NetCDF file (default: same name as WAV with .nc extension)

        Returns:
            Tuple of (xarray.Dataset containing spectrogram, path to saved NetCDF file)
        """
        if sf is None:
            raise ImportError("soundfile is required. Install with: pip install soundfile")

        # Read WAV file
        logger.info(f"Reading WAV file: {wav_path}")
        audio, sample_rate = sf.read(str(wav_path))

        # Handle stereo by taking first channel
        if len(audio.shape) > 1:
            logger.info(f"Stereo audio detected, using first channel")
            audio = audio[:, 0]

        # Calculate spectrogram
        logger.info(f"Calculating spectrogram (nfft={self.nfft}, hop={self.hop_length})")
        spectrogram, times, freqs = self._calculate_spectrogram(audio, sample_rate)

        # Parse datetime from filename
        begin_time = self.parse_datetime_from_filename(wav_path.name)
        if begin_time is None:
            # Fallback to file modification time
            logger.warning(f"Using file modification time as fallback")
            begin_time = datetime.fromtimestamp(wav_path.stat().st_mtime)

        duration = len(audio) / sample_rate
        end_time = begin_time + timedelta(seconds=duration)

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
                'end': end_time.isoformat(),
                'sample_rate': float(sample_rate),
                'nfft': int(self.nfft),
                'hop_length': int(self.hop_length),
                'window': self.window,
                'db_ref': float(self.ref_db),
                'duration': float(duration),
                'audio_file': wav_path.name,
                'created_at': datetime.now().isoformat(),
            }
        )

        # Save to NetCDF if output path is provided
        saved_path = None
        if output_path is None:
            output_path = wav_path.with_suffix('.nc')

        logger.info(f"Saving NetCDF spectrogram to: {output_path}")
        ds.to_netcdf(output_path, format='NETCDF4')
        saved_path = output_path

        return ds, saved_path

    def wav_to_multi_fft_spectrogram(
        self,
        wav_path: Path,
        fft_configs: list,
        output_path: Optional[Path] = None
    ) -> Tuple[xr.Dataset, Optional[Path]]:
        """
        Convert WAV file to NetCDF spectrogram with multiple FFT sizes

        Args:
            wav_path: Path to input WAV file
            fft_configs: List of dicts with 'nfft' and 'hop_length' keys
            output_path: Optional path for output NetCDF file (default: same name as WAV with .nc extension)

        Returns:
            Tuple of (xarray.Dataset containing spectrograms, path to saved NetCDF file)
        """
        if sf is None:
            raise ImportError("soundfile is required. Install with: pip install soundfile")

        # Read WAV file once
        logger.info(f"Reading WAV file: {wav_path}")
        audio, sample_rate = sf.read(str(wav_path))

        # Handle stereo by taking first channel
        if len(audio.shape) > 1:
            logger.info(f"Stereo audio detected, using first channel")
            audio = audio[:, 0]

        # Parse datetime from filename
        begin_time = self.parse_datetime_from_filename(wav_path.name)
        if begin_time is None:
            # Fallback to file modification time
            logger.warning(f"Using file modification time as fallback")
            begin_time = datetime.fromtimestamp(wav_path.stat().st_mtime)

        duration = len(audio) / sample_rate
        end_time = begin_time + timedelta(seconds=duration)

        # Calculate spectrograms for each FFT configuration
        data_vars = {}
        coords = {}

        for config in fft_configs:
            nfft = config['nfft']
            hop_length = config['hop_length']

            logger.info(f"Calculating spectrogram (nfft={nfft}, hop={hop_length})")

            # Temporarily set instance variables for _calculate_spectrogram
            old_nfft = self.nfft
            old_hop = self.hop_length
            self.nfft = nfft
            self.hop_length = hop_length

            spectrogram, times, freqs = self._calculate_spectrogram(audio, sample_rate)

            # Restore original values
            self.nfft = old_nfft
            self.hop_length = old_hop

            # Add to dataset with FFT-specific names
            var_name = f'spectrogram_fft{nfft}'
            time_coord = f'time_fft{nfft}'
            freq_coord = f'frequency_fft{nfft}'

            data_vars[var_name] = ([freq_coord, time_coord], spectrogram)
            coords[time_coord] = times
            coords[freq_coord] = freqs

        # Create xarray Dataset with multiple spectrograms
        ds = xr.Dataset(
            data_vars=data_vars,
            coords=coords,
            attrs={
                'begin': begin_time.isoformat(),
                'end': end_time.isoformat(),
                'sample_rate': float(sample_rate),
                'window': self.window,
                'db_ref': float(self.ref_db),
                'duration': float(duration),
                'audio_file': wav_path.name,
                'created_at': datetime.now().isoformat(),
                'fft_sizes': ','.join(str(c['nfft']) for c in fft_configs),
            }
        )

        # Save to NetCDF
        if output_path is None:
            output_path = wav_path.with_suffix('.nc')

        logger.info(f"Saving multi-FFT NetCDF spectrogram to: {output_path}")
        ds.to_netcdf(output_path, format='NETCDF4')

        return ds, output_path

    def _calculate_spectrogram(
        self,
        audio: np.ndarray,
        sample_rate: int
    ) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
        """
        Calculate spectrogram from audio samples

        Args:
            audio: Audio samples
            sample_rate: Sample rate in Hz

        Returns:
            Tuple of (spectrogram in dB, time array, frequency array)
        """
        # Create window function
        if self.window == 'hann':
            window = np.hanning(self.nfft)
        elif self.window == 'hamming':
            window = np.hamming(self.nfft)
        elif self.window == 'blackman':
            window = np.blackman(self.nfft)
        else:
            window = np.ones(self.nfft)

        # Calculate number of frames
        n_frames = (len(audio) - self.nfft) // self.hop_length + 1
        n_freqs = self.nfft // 2 + 1

        # Initialize spectrogram array
        spectrogram = np.zeros((n_freqs, n_frames))

        # Calculate STFT
        for i in range(n_frames):
            start = i * self.hop_length
            end = start + self.nfft

            if end > len(audio):
                # Pad with zeros if needed
                frame = np.zeros(self.nfft)
                frame[:len(audio) - start] = audio[start:]
            else:
                frame = audio[start:end]

            # Apply window
            windowed = frame * window

            # FFT
            fft = np.fft.rfft(windowed)

            # Magnitude
            spectrogram[:, i] = np.abs(fft)

        # Convert to dB
        spectrogram_db = 20 * np.log10(spectrogram + 1e-10)

        # Normalize
        spectrogram_db = spectrogram_db - spectrogram_db.mean()

        # Create time and frequency arrays
        times = np.arange(n_frames) * self.hop_length / sample_rate
        freqs = np.fft.rfftfreq(self.nfft, 1.0 / sample_rate)

        return spectrogram_db, times, freqs

    def process_folder(
        self,
        input_folder: Path,
        output_folder: Optional[Path] = None,
        pattern: str = "*.wav"
    ) -> list:
        """
        Process all WAV files in a folder

        Args:
            input_folder: Folder containing WAV files
            output_folder: Optional output folder (default: same as input)
            pattern: Glob pattern for WAV files (default: "*.wav")

        Returns:
            List of (wav_path, netcdf_path) tuples
        """
        if output_folder is None:
            output_folder = input_folder
        else:
            output_folder.mkdir(parents=True, exist_ok=True)

        input_folder = Path(input_folder)
        wav_files = sorted(input_folder.glob(pattern))

        if not wav_files:
            logger.warning(f"No WAV files found in {input_folder} matching pattern '{pattern}'")
            return []

        logger.info(f"Found {len(wav_files)} WAV files to process")

        results = []
        for wav_path in wav_files:
            try:
                output_path = output_folder / wav_path.with_suffix('.nc').name
                _, saved_path = self.wav_to_spectrogram(wav_path, output_path)
                results.append((wav_path, saved_path))
                logger.info(f"✓ Processed: {wav_path.name}")
            except Exception as e:
                logger.error(f"✗ Failed to process {wav_path.name}: {e}")

        logger.info(f"Completed processing {len(results)}/{len(wav_files)} files")
        return results
