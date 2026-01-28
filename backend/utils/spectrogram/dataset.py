"""
Simple dataset structure for APLOSE

Reads a folder containing WAV files and corresponding NetCDF spectrograms
"""

import json
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)

try:
    import xarray as xr
except ImportError:
    logger.warning("xarray not installed. Install with: pip install xarray netcdf4")
    xr = None


class SpectrogramFile:
    """Represents a single spectrogram file in the dataset"""

    def __init__(self, netcdf_path: Path, wav_path: Optional[Path] = None, nfft: Optional[int] = None):
        """
        Initialize spectrogram file

        Args:
            netcdf_path: Path to NetCDF spectrogram file
            wav_path: Optional path to corresponding WAV file
            nfft: Optional FFT size to extract (for multi-FFT files)
        """
        self.netcdf_path = netcdf_path
        self.wav_path = wav_path
        self.nfft = nfft
        self._metadata = None
        self._ds = None

    @property
    def metadata(self) -> Dict:
        """Get metadata from NetCDF file without loading full data"""
        if self._metadata is None:
            self._metadata = self._read_metadata()
        return self._metadata

    def _read_metadata(self) -> Dict:
        """Read metadata from NetCDF file"""
        if xr is None:
            raise ImportError("xarray is required. Install with: pip install xarray netcdf4")

        try:
            with xr.open_dataset(self.netcdf_path) as ds:
                # Check if this is a multi-FFT file
                fft_sizes_str = ds.attrs.get('fft_sizes', '')
                is_multi_fft = bool(fft_sizes_str)

                if is_multi_fft and self.nfft:
                    # Extract metadata for specific FFT size
                    var_name = f'spectrogram_fft{self.nfft}'
                    time_coord = f'time_fft{self.nfft}'
                    freq_coord = f'frequency_fft{self.nfft}'

                    if var_name in ds.data_vars:
                        metadata = {
                            'begin': ds.attrs.get('begin', ''),
                            'end': ds.attrs.get('end', ''),
                            'sample_rate': ds.attrs.get('sample_rate', 0),
                            'duration': ds.attrs.get('duration', 0),
                            'nfft': self.nfft,
                            'hop_length': self._infer_hop_length(ds, time_coord, self.nfft),
                            'audio_file': ds.attrs.get('audio_file', ''),
                            'time_shape': len(ds.coords[time_coord]),
                            'frequency_shape': len(ds.coords[freq_coord]),
                            'frequency_min': float(ds.coords[freq_coord].min()),
                            'frequency_max': float(ds.coords[freq_coord].max()),
                        }
                    else:
                        logger.error(f"FFT size {self.nfft} not found in {self.netcdf_path}")
                        return {}
                else:
                    # Legacy single-FFT file format
                    metadata = {
                        'begin': ds.attrs.get('begin', ''),
                        'end': ds.attrs.get('end', ''),
                        'sample_rate': ds.attrs.get('sample_rate', 0),
                        'duration': ds.attrs.get('duration', 0),
                        'nfft': ds.attrs.get('nfft', 0),
                        'hop_length': ds.attrs.get('hop_length', 0),
                        'audio_file': ds.attrs.get('audio_file', ''),
                        'time_shape': len(ds.coords.get('time', [])),
                        'frequency_shape': len(ds.coords.get('frequency', [])),
                        'frequency_min': float(ds.coords.get('frequency', [0]).min()) if 'frequency' in ds.coords else 0,
                        'frequency_max': float(ds.coords.get('frequency', [0]).max()) if 'frequency' in ds.coords else 0,
                    }

            return metadata
        except Exception as e:
            logger.error(f"Failed to read metadata from {self.netcdf_path}: {e}")
            return {}

    def _infer_hop_length(self, ds: xr.Dataset, time_coord: str, nfft: int) -> int:
        """Infer hop length from time coordinate spacing"""
        try:
            sample_rate = ds.attrs.get('sample_rate', 48000)
            time_vals = ds.coords[time_coord].values
            if len(time_vals) > 1:
                time_step = float(time_vals[1] - time_vals[0])
                hop_length = int(time_step * sample_rate)
                return hop_length
            return nfft // 4  # Default guess
        except Exception:
            return nfft // 4  # Default guess

    def load_dataset(self) -> Optional[xr.Dataset]:
        """Load the full xarray dataset"""
        if xr is None:
            raise ImportError("xarray is required. Install with: pip install xarray netcdf4")

        if self._ds is None:
            try:
                full_ds = xr.open_dataset(self.netcdf_path)

                # Check if this is a multi-FFT file and we have a specific nfft
                fft_sizes_str = full_ds.attrs.get('fft_sizes', '')
                if fft_sizes_str and self.nfft:
                    # Extract only the relevant spectrogram for this FFT size
                    var_name = f'spectrogram_fft{self.nfft}'
                    time_coord = f'time_fft{self.nfft}'
                    freq_coord = f'frequency_fft{self.nfft}'

                    if var_name in full_ds.data_vars:
                        # Create a new dataset with standard names
                        self._ds = xr.Dataset(
                            {
                                'spectrogram': full_ds[var_name].rename({
                                    time_coord: 'time',
                                    freq_coord: 'frequency'
                                })
                            },
                            attrs=full_ds.attrs.copy()
                        )
                        # Update attrs to reflect this specific FFT
                        self._ds.attrs['nfft'] = self.nfft
                        self._ds.attrs['hop_length'] = self._infer_hop_length(full_ds, time_coord, self.nfft)
                    else:
                        logger.error(f"FFT size {self.nfft} not found in {self.netcdf_path}")
                        return None
                else:
                    # Legacy single-FFT file
                    self._ds = full_ds

            except Exception as e:
                logger.error(f"Failed to load dataset from {self.netcdf_path}: {e}")
                return None
        return self._ds

    def close(self):
        """Close the dataset if it's open"""
        if self._ds is not None:
            self._ds.close()
            self._ds = None

    def __repr__(self):
        return f"SpectrogramFile(netcdf={self.netcdf_path.name}, wav={self.wav_path.name if self.wav_path else 'None'})"


class SimpleDataset:
    """
    Simple dataset structure for APLOSE

    A dataset is a folder containing:
    - WAV files (audio recordings)
    - NetCDF files (spectrograms, one per WAV file)
    - Optional: metadata.json with dataset-level information
    """

    def __init__(self, folder: Path):
        """
        Initialize dataset from a folder

        Args:
            folder: Path to dataset folder
        """
        self.folder = Path(folder)
        self.name = self.folder.name
        self._spectrograms = None
        self._metadata = None

        if not self.folder.exists():
            raise ValueError(f"Dataset folder does not exist: {self.folder}")

    @property
    def spectrograms(self) -> List[SpectrogramFile]:
        """Get list of spectrogram files in the dataset"""
        if self._spectrograms is None:
            self._spectrograms = self._scan_spectrograms()
        return self._spectrograms

    def _scan_spectrograms(self) -> List[SpectrogramFile]:
        """Scan folder for NetCDF spectrograms and match with WAV files"""
        netcdf_files = sorted(self.folder.glob("*.nc"))

        if not netcdf_files:
            logger.warning(f"No NetCDF files found in {self.folder}")
            return []

        spectrograms = []
        for nc_path in netcdf_files:
            # Look for corresponding WAV file
            wav_path = nc_path.with_suffix('.wav')
            if not wav_path.exists():
                # Try case-insensitive search, stripping FFT suffix if present
                wav_path = self._find_wav_file(nc_path.stem)

            # Check if this is a multi-FFT file
            try:
                if xr is None:
                    raise ImportError("xarray is required")

                with xr.open_dataset(nc_path) as ds:
                    fft_sizes_str = ds.attrs.get('fft_sizes', '')

                    if fft_sizes_str:
                        # Multi-FFT file: create one SpectrogramFile per FFT size
                        fft_sizes = [int(s.strip()) for s in fft_sizes_str.split(',')]
                        logger.info(f"Found multi-FFT file {nc_path.name} with FFT sizes: {fft_sizes}")

                        for nfft in fft_sizes:
                            spec_file = SpectrogramFile(
                                nc_path,
                                wav_path if wav_path and wav_path.exists() else None,
                                nfft=nfft
                            )
                            spectrograms.append(spec_file)
                    else:
                        # Legacy single-FFT file
                        spec_file = SpectrogramFile(nc_path, wav_path if wav_path and wav_path.exists() else None)
                        spectrograms.append(spec_file)

            except Exception as e:
                logger.error(f"Failed to read {nc_path}: {e}")
                # Fallback: treat as legacy file
                spec_file = SpectrogramFile(nc_path, wav_path if wav_path and wav_path.exists() else None)
                spectrograms.append(spec_file)

        logger.info(f"Found {len(spectrograms)} spectrograms in {self.folder}")
        return spectrograms

    def _find_wav_file(self, stem: str) -> Optional[Path]:
        """
        Find WAV file with given stem (case-insensitive)
        """
        # Try exact match first
        for wav_path in self.folder.glob("*.wav"):
            if wav_path.stem.lower() == stem.lower():
                return wav_path
        for wav_path in self.folder.glob("*.WAV"):
            if wav_path.stem.lower() == stem.lower():
                return wav_path

        return None

    @property
    def metadata(self) -> Dict:
        """Get dataset-level metadata"""
        if self._metadata is None:
            self._metadata = self._read_dataset_metadata()
        return self._metadata

    def _read_dataset_metadata(self) -> Dict:
        """Read dataset metadata from metadata.json if it exists"""
        metadata_path = self.folder / "metadata.json"

        if metadata_path.exists():
            try:
                with open(metadata_path, 'r') as f:
                    metadata = json.load(f)
                logger.info(f"Loaded metadata from {metadata_path}")
                return metadata
            except Exception as e:
                logger.error(f"Failed to read metadata.json: {e}")

        # Generate default metadata
        metadata = {
            'name': self.name,
            'folder': str(self.folder),
            'n_spectrograms': len(self.spectrograms),
            'created_at': datetime.now().isoformat(),
        }

        # Add time range if spectrograms exist
        if self.spectrograms:
            begin_times = []
            end_times = []
            for spec in self.spectrograms:
                if spec.metadata.get('begin'):
                    begin_times.append(spec.metadata['begin'])
                if spec.metadata.get('end'):
                    end_times.append(spec.metadata['end'])

            if begin_times:
                metadata['begin'] = min(begin_times)
            if end_times:
                metadata['end'] = max(end_times)

        return metadata

    def save_metadata(self, additional_info: Optional[Dict] = None):
        """
        Save dataset metadata to metadata.json

        Args:
            additional_info: Additional metadata to include
        """
        metadata = self.metadata.copy()
        if additional_info:
            metadata.update(additional_info)

        metadata_path = self.folder / "metadata.json"
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)

        logger.info(f"Saved metadata to {metadata_path}")

    def get_spectrogram_by_time(self, timestamp: datetime) -> Optional[SpectrogramFile]:
        """
        Find spectrogram that contains the given timestamp

        Args:
            timestamp: Datetime to search for

        Returns:
            SpectrogramFile or None if not found
        """
        for spec in self.spectrograms:
            begin_str = spec.metadata.get('begin')
            end_str = spec.metadata.get('end')

            if begin_str and end_str:
                try:
                    begin = datetime.fromisoformat(begin_str.replace('+0000', ''))
                    end = datetime.fromisoformat(end_str.replace('+0000', ''))

                    if begin <= timestamp <= end:
                        return spec
                except Exception as e:
                    logger.warning(f"Failed to parse timestamps: {e}")

        return None

    def get_spectrogram_list(self) -> List[Dict]:
        """
        Get list of spectrograms with metadata

        Returns:
            List of dictionaries with spectrogram info
        """
        result = []
        for spec in self.spectrograms:
            info = {
                'netcdf_path': str(spec.netcdf_path),
                'netcdf_name': spec.netcdf_path.name,
                'wav_path': str(spec.wav_path) if spec.wav_path else None,
                'wav_name': spec.wav_path.name if spec.wav_path else None,
                **spec.metadata
            }
            result.append(info)
        return result

    def close_all(self):
        """Close all open datasets"""
        if self._spectrograms:
            for spec in self._spectrograms:
                spec.close()

    def __repr__(self):
        return f"SimpleDataset(name='{self.name}', spectrograms={len(self.spectrograms)})"

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close_all()
