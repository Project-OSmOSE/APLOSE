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

    def __init__(self, netcdf_path: Path, wav_path: Optional[Path] = None):
        """
        Initialize spectrogram file

        Args:
            netcdf_path: Path to NetCDF spectrogram file
            wav_path: Optional path to corresponding WAV file
        """
        self.netcdf_path = netcdf_path
        self.wav_path = wav_path
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
                metadata = {
                    'begin': ds.attrs.get('begin', ''),
                    'end': ds.attrs.get('end', ''),
                    'sample_rate': ds.attrs.get('sample_rate', 0),
                    'duration': ds.attrs.get('duration', 0),
                    'nfft': ds.attrs.get('nfft', 0),
                    'hop_length': ds.attrs.get('hop_length', 0),
                    'audio_file': ds.attrs.get('audio_file', ''),
                    'time_shape': len(ds.coords['time']),
                    'frequency_shape': len(ds.coords['frequency']),
                    'frequency_min': float(ds.coords['frequency'].min()),
                    'frequency_max': float(ds.coords['frequency'].max()),
                }
            return metadata
        except Exception as e:
            logger.error(f"Failed to read metadata from {self.netcdf_path}: {e}")
            return {}

    def load_dataset(self) -> Optional[xr.Dataset]:
        """Load the full xarray dataset"""
        if xr is None:
            raise ImportError("xarray is required. Install with: pip install xarray netcdf4")

        if self._ds is None:
            try:
                self._ds = xr.open_dataset(self.netcdf_path)
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

            spec_file = SpectrogramFile(nc_path, wav_path if wav_path and wav_path.exists() else None)
            spectrograms.append(spec_file)

        logger.info(f"Found {len(spectrograms)} spectrograms in {self.folder}")
        return spectrograms

    def _find_wav_file(self, stem: str) -> Optional[Path]:
        """
        Find WAV file with given stem (case-insensitive)

        Handles filenames with FFT suffix (e.g., '2024_01_15_08_00_00_fft1024' -> '2024_01_15_08_00_00.wav')
        """
        import re

        # Strip FFT suffix if present (e.g., _fft1024, _fft2048)
        base_stem = re.sub(r'_fft\d+$', '', stem, flags=re.IGNORECASE)

        # Try exact match first
        for wav_path in self.folder.glob("*.wav"):
            if wav_path.stem.lower() == stem.lower():
                return wav_path
        for wav_path in self.folder.glob("*.WAV"):
            if wav_path.stem.lower() == stem.lower():
                return wav_path

        # Try with FFT suffix stripped
        if base_stem != stem:
            for wav_path in self.folder.glob("*.wav"):
                if wav_path.stem.lower() == base_stem.lower():
                    return wav_path
            for wav_path in self.folder.glob("*.WAV"):
                if wav_path.stem.lower() == base_stem.lower():
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
