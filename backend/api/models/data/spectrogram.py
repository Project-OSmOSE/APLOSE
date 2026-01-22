"""Spectrogram model"""
import csv
import json
import logging
from datetime import datetime, timedelta
from os.path import join
from pathlib import Path
from typing import Optional, Dict, Any

from django.conf import settings
from django.db import models
from django.utils import timezone as django_timezone
from django.db.models import Q, F, Manager, QuerySet
from metadatax.data.models import FileFormat

logger = logging.getLogger(__name__)

# Try to import osekit for backward compatibility with legacy datasets
try:
    from osekit.config import TIMESTAMP_FORMAT_EXPORTED_FILES_LOCALIZED
    from osekit.core_api.spectro_data import SpectroData
    from osekit.core_api.spectro_dataset import SpectroDataset
    OSEKIT_AVAILABLE = True
except ImportError:
    # Define constant locally if osekit not available
    TIMESTAMP_FORMAT_EXPORTED_FILES_LOCALIZED = "%Y_%m_%d_%H_%M_%S_%f%z"
    SpectroData = None
    SpectroDataset = None
    OSEKIT_AVAILABLE = False

try:
    import xarray as xr
    import numpy as np
    NETCDF_AVAILABLE = True
except ImportError:
    NETCDF_AVAILABLE = False

from .__abstract_file import AbstractFile
from .__abstract_time_segment import TimeSegment
from .spectrogram_analysis import SpectrogramAnalysis


class SpectrogramManager(Manager):
    """Spectrogram manager"""

    def validate_analysis_links(self, analysis: SpectrogramAnalysis) -> dict:
        """
        Validate that spectrograms are properly linked to an analysis.
        Returns diagnostic information about the links.
        """
        spectrograms = self.filter(analysis=analysis)
        issues = {
            'total_spectrograms': spectrograms.count(),
            'missing_files': [],
            'duplicate_links': 0,
        }

        for spec in spectrograms:
            # Check if the NetCDF file actually exists
            if not OSEKIT_AVAILABLE and not analysis.dataset.legacy:
                netcdf_path = analysis.get_netcdf_path()
                if not netcdf_path.exists():
                    issues['missing_files'].append(str(netcdf_path))

            # Check for duplicate many-to-many links
            link_count = spec.analysis.filter(id=analysis.id).count()
            if link_count > 1:
                issues['duplicate_links'] += 1

        return issues

    def import_all_for_analysis(self, analysis: SpectrogramAnalysis) -> ["Spectrogram"]:
        """Import spectrograms for a given analysis"""

        spectrograms_data = []
        if analysis.dataset.legacy:
            audio_csv_path = join(
                settings.DATASET_IMPORT_FOLDER,
                analysis.dataset.path,
                "data",
                "audio",
                Path(analysis.path).parts[-2],  # audio config folder
                "metadata.csv",
            )
            with open(audio_csv_path, encoding="utf-8") as csvfile:
                audio: dict = next(csv.DictReader(csvfile))
            timestamp_csv_path = join(
                settings.DATASET_IMPORT_FOLDER,
                analysis.dataset.path,
                "data",
                "audio",
                Path(analysis.path).parts[-2],  # audio config folder
                "timestamp.csv",
            )
            with open(timestamp_csv_path, encoding="utf-8") as csvfile:
                files: [dict] = list(f for f in csv.DictReader(csvfile))
            file: dict
            for file in files:
                filename = Path(file["filename"]).stem
                start = datetime.fromisoformat(file["timestamp"])
                spectrograms_data.append(
                    {
                        "filename": filename,
                        "start": start,
                        "end": start
                        + timedelta(seconds=int(audio["audio_file_dataset_duration"])),
                    }
                )
        else:
            # For new simple NetCDF datasets, use SimpleDataset
            if not OSEKIT_AVAILABLE:
                # Use simple dataset structure
                # For simple datasets, each analysis corresponds to ONE NetCDF file
                # We should only import the spectrogram for THIS analysis, not all spectrograms
                try:
                    netcdf_path = analysis.get_netcdf_path()
                    if netcdf_path.exists() and netcdf_path.suffix == '.nc':
                        from backend.utils.spectrogram.dataset import SpectrogramFile
                        spec_file = SpectrogramFile(netcdf_path)
                        metadata = spec_file.metadata

                        if metadata.get('begin') and metadata.get('end'):
                            # Parse datetimes and make them timezone-aware
                            start = datetime.fromisoformat(metadata['begin'].replace('+0000', '').replace('Z', ''))
                            end = datetime.fromisoformat(metadata['end'].replace('+0000', '').replace('Z', ''))

                            # Make timezone-aware if they're naive
                            if start.tzinfo is None:
                                start = django_timezone.make_aware(start, django_timezone.utc)
                            if end.tzinfo is None:
                                end = django_timezone.make_aware(end, django_timezone.utc)

                            spectrograms_data.append({
                                "filename": spec_file.netcdf_path.stem,
                                "start": start,
                                "end": end,
                            })
                except (ValueError, AttributeError, FileNotFoundError) as e:
                    logger.warning(f"Failed to load spectrogram for analysis {analysis.name}: {e}")
            else:
                # Legacy OSEkit support
                for data in analysis.get_osekit_spectro_dataset().data:
                    spectrograms_data.append(
                        {
                            "filename": data.begin.strftime(
                                TIMESTAMP_FORMAT_EXPORTED_FILES_LOCALIZED
                            ),
                            "start": data.begin,
                            "end": data.end,
                        }
                    )

        existing_spectrograms = []
        new_spectrograms = []

        # Check if we have NetCDF files (works for both legacy and OSEkit formats)
        file_extension = "png"

        if analysis.dataset.legacy:
            # Check in legacy location for NetCDF files
            legacy_spectro_path = join(
                settings.DATASET_IMPORT_FOLDER,
                analysis.dataset.path,
                analysis.path,
                "image"
            )
            if Path(legacy_spectro_path).exists():
                nc_files = list(Path(legacy_spectro_path).glob("*.nc"))
                if nc_files:
                    file_extension = "nc"
        else:
            # Check for NetCDF files in simple or OSEkit location
            if not OSEKIT_AVAILABLE:
                # Simple NetCDF structure - check if the analysis path itself is a NetCDF file
                netcdf_path = analysis.get_netcdf_path()
                if netcdf_path.exists() and netcdf_path.suffix == '.nc':
                    file_extension = "nc"
            else:
                # Check in OSEkit location for NetCDF files
                spectro_dataset = analysis.get_osekit_spectro_dataset()
                if spectro_dataset.folder:
                    spectro_folder = Path(spectro_dataset.folder) / "spectrogram"
                    if spectro_folder.exists():
                        nc_files = list(spectro_folder.glob("*.nc"))
                        if nc_files:
                            file_extension = "nc"

        img_format, _ = FileFormat.objects.get_or_create(name=file_extension)
        dataset_spectrograms = Spectrogram.objects.filter(
            analysis__dataset=analysis.dataset
        )
        for data in spectrograms_data:
            if dataset_spectrograms.filter(
                filename=data["filename"],
                format=img_format,
                start=data["start"],
                end=data["end"],
            ).exists():
                existing_spectrograms.append(
                    dataset_spectrograms.filter(
                        filename=data["filename"],
                        format=img_format,
                        start=data["start"],
                        end=data["end"],
                    ).first()
                )
            else:
                new_spectrograms.append(
                    Spectrogram(
                        filename=data["filename"],
                        format=img_format,
                        start=data["start"],
                        end=data["end"],
                    )
                )

        # Create new spectrograms with conflict handling
        if new_spectrograms:
            created_spectrograms = Spectrogram.objects.bulk_create(
                new_spectrograms, ignore_conflicts=True
            )

            # bulk_create with ignore_conflicts doesn't return IDs, so query for them
            # Match by filename, start, and end times
            new_spectrograms_with_ids = []
            for spec in new_spectrograms:
                matched = Spectrogram.objects.filter(
                    filename=spec.filename,
                    format=spec.format,
                    start=spec.start,
                    end=spec.end
                ).first()
                if matched:
                    new_spectrograms_with_ids.append(matched)

            new_spectrograms = new_spectrograms_with_ids

        # Link spectrograms to analysis
        spectrogram_analysis_rel = []

        # For NEW spectrograms, always create the link
        for spectrogram in new_spectrograms:
            spectrogram_analysis_rel.append(
                Spectrogram.analysis.through(
                    spectrogram=spectrogram, spectrogramanalysis=analysis
                )
            )

        # For EXISTING spectrograms, check if already linked before creating relationship
        for spectrogram in existing_spectrograms:
            # Check if this spectrogram is already linked to this analysis
            if not spectrogram.analysis.filter(id=analysis.id).exists():
                spectrogram_analysis_rel.append(
                    Spectrogram.analysis.through(
                        spectrogram=spectrogram, spectrogramanalysis=analysis
                    )
                )

        # Bulk create relationships with conflict handling
        if spectrogram_analysis_rel:
            try:
                Spectrogram.analysis.through.objects.bulk_create(
                    spectrogram_analysis_rel, ignore_conflicts=True
                )
            except Exception as e:
                logger.error(f"Failed to create spectrogram-analysis relationships: {e}")
                # Fall back to individual creation
                for rel in spectrogram_analysis_rel:
                    try:
                        rel.save()
                    except Exception:
                        pass  # Already exists

        # Combine all spectrograms for return value
        spectrograms = existing_spectrograms + new_spectrograms

        logger.info(
            f"Imported {len(new_spectrograms)} new spectrograms, "
            f"linked {len(spectrogram_analysis_rel)} to analysis {analysis.id}"
        )
        return spectrograms

    def filter_for_file_range(self, file_range: "AnnotationFileRange"):
        """Get files for a given file range"""
        return self.filter(
            analysis__dataset_id=file_range.annotation_phase.annotation_campaign.dataset_id,
            start__gte=file_range.from_datetime,
            end__lte=file_range.to_datetime,
        )

    def filter_matches_time_range(
        self, start: datetime, end: datetime
    ) -> QuerySet["Spectrogram"]:
        """Get files from absolute start and ends"""
        return self.filter(
            Q(start__lte=start, end__gt=start)
            | Q(start__gte=start, end__lte=end)
            | Q(start__lt=end, end__gte=end)
        ).order_by("start", "id")


class Spectrogram(AbstractFile, TimeSegment, models.Model):
    """Spectrogram model"""

    objects = SpectrogramManager()

    class Meta:
        ordering = ("start", "id")
        constraints = [
            models.CheckConstraint(
                name="start is lower than end", check=Q(start__lt=F("end"))
            )
        ]

    def __str__(self):
        return f"{self.filename}.{self.format}"

    analysis = models.ManyToManyField(SpectrogramAnalysis, related_name="spectrograms")

    def get_spectro_data_for(self, analysis: SpectrogramAnalysis) -> SpectroData:
        spectro_dataset: SpectroDataset = analysis.get_osekit_spectro_dataset()
        return [d for d in spectro_dataset.data if d.name == self.filename].pop()

    def is_netcdf(self) -> bool:
        """Check if this spectrogram is a NetCDF file"""
        return self.format.name == "nc"

    def get_netcdf_data(self, analysis: SpectrogramAnalysis) -> Optional[Dict[str, Any]]:
        """Read NetCDF file and return data as dictionary"""
        if not NETCDF_AVAILABLE:
            return None

        if not self.is_netcdf():
            return None

        try:
            # Build path to NetCDF file
            if analysis.dataset.legacy:
                nc_path = join(
                    settings.DATASET_IMPORT_FOLDER,
                    analysis.dataset.path,
                    analysis.path,
                    "image",
                    f"{self.filename}.nc",
                )
            else:
                # Check if this is a simple NetCDF dataset or OSEkit dataset
                if not OSEKIT_AVAILABLE:
                    # Simple NetCDF dataset: analysis.path points to dataset folder
                    # Construct path: dataset_folder / filename.nc
                    nc_path = join(
                        settings.DATASET_IMPORT_FOLDER,
                        analysis.path,
                        f"{self.filename}.nc"
                    )
                else:
                    # OSEkit dataset
                    spectro_dataset: SpectroDataset = analysis.get_osekit_spectro_dataset()
                    nc_path = join(
                        str(spectro_dataset.folder),
                        "spectrogram",
                        f"{self.filename}.nc",
                    )

            # Read NetCDF file
            ds = xr.open_dataset(nc_path)

            # Extract spectrogram data
            spectrogram_data = ds['spectrogram'].values

            # Get time and frequency arrays
            time_coords = ds.coords['time'].values if 'time' in ds.coords else np.arange(spectrogram_data.shape[1])
            freq_coords = ds.coords['frequency'].values if 'frequency' in ds.coords else np.arange(spectrogram_data.shape[0])

            # Get attributes
            attrs = dict(ds.attrs)

            # Close dataset
            ds.close()

            # Convert numpy arrays to lists for JSON serialization
            # Downsample if needed for large spectrograms
            max_samples = 4000  # Maximum number of samples to send
            time_step = max(1, spectrogram_data.shape[1] // max_samples)
            freq_step = max(1, spectrogram_data.shape[0] // max_samples)

            downsampled_data = spectrogram_data[::freq_step, ::time_step]
            downsampled_time = time_coords[::time_step]
            downsampled_freq = freq_coords[::freq_step]

            # Convert numpy types to native Python types for JSON serialization
            def convert_numpy_types(obj):
                """Convert numpy types to native Python types"""
                if isinstance(obj, np.integer):
                    return int(obj)
                elif isinstance(obj, np.floating):
                    return float(obj)
                elif isinstance(obj, np.ndarray):
                    return obj.tolist()
                elif isinstance(obj, list):
                    return [convert_numpy_types(item) for item in obj]
                elif isinstance(obj, dict):
                    return {key: convert_numpy_types(value) for key, value in obj.items()}
                return obj

            return {
                'spectrogram': convert_numpy_types(downsampled_data),
                'time': convert_numpy_types(downsampled_time),
                'frequency': convert_numpy_types(downsampled_freq),
                'attributes': convert_numpy_types(attrs),
                'shape': [int(s) for s in spectrogram_data.shape],  # Explicitly convert to int
                'downsampling': {
                    'time_step': int(time_step),
                    'freq_step': int(freq_step),
                },
            }

        except Exception as e:
            print(f"Error reading NetCDF file: {e}")
            return None
