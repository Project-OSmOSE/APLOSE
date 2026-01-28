"""
Import simple dataset mutation for APLOSE

This mutation imports datasets in the new simple format:
- One folder containing WAV files and corresponding NetCDF spectrograms
- No complex OSEkit structure needed
"""

import logging
from datetime import datetime
from pathlib import Path

from django.conf import settings
from django.db import transaction
from graphene import String, Boolean, Mutation
from graphql import GraphQLError

from backend.api.models import Dataset, SpectrogramAnalysis, Spectrogram
from backend.utils.schema import GraphQLResolve, GraphQLPermissions
from backend.utils.spectrogram.dataset import SimpleDataset

logger = logging.getLogger(__name__)


class ImportSimpleDatasetMutation(Mutation):
    """Import simple dataset mutation"""

    class Arguments:
        name = String(required=True, description="Dataset name")
        path = String(required=True, description="Relative path from DATASET_IMPORT_FOLDER")

    ok = Boolean(required=True)
    message = String()

    @GraphQLResolve(permission=GraphQLPermissions.STAFF_OR_SUPERUSER)
    @transaction.atomic
    def mutate(self, info, name, path):
        """
        Import a simple dataset

        Args:
            name: Dataset name (for display)
            path: Relative path from DATASET_IMPORT_FOLDER to the dataset folder

        Returns:
            ImportSimpleDatasetMutation with ok=True if successful
        """
        logger.info(f"Importing simple dataset: name='{name}', path='{path}'")

        # Get full path to dataset folder
        dataset_folder = settings.DATASET_IMPORT_FOLDER / path

        if not dataset_folder.exists():
            raise GraphQLError(f"Dataset folder not found: {dataset_folder}")

        if not dataset_folder.is_dir():
            raise GraphQLError(f"Path is not a directory: {dataset_folder}")

        # Try to load as SimpleDataset
        try:
            simple_dataset = SimpleDataset(dataset_folder)
        except Exception as e:
            logger.error(f"Failed to load dataset: {e}")
            raise GraphQLError(f"Failed to load dataset: {str(e)}")

        # Check if dataset has spectrograms
        if not simple_dataset.spectrograms:
            raise GraphQLError(
                f"No NetCDF spectrograms found in {dataset_folder}. "
                "Please generate spectrograms first using the spectrogram generator."
            )

        logger.info(f"Found {len(simple_dataset.spectrograms)} spectrograms")

        # Create or get Dataset record
        dataset, created = Dataset.objects.get_or_create(
            name=name,
            path=path,
            owner=info.context.user,
        )

        if not created:
            logger.info(f"Dataset '{name}' already exists, will update analyses")

        # Group spectrograms by FFT size to create separate analyses
        from collections import defaultdict
        spectrograms_by_fft = defaultdict(list)

        for spec_file in simple_dataset.spectrograms:
            nfft = spec_file.metadata.get('nfft', 2048)
            spectrograms_by_fft[nfft].append(spec_file)

        logger.info(f"Found {len(spectrograms_by_fft)} different FFT sizes: {list(spectrograms_by_fft.keys())}")

        # Get or create default colormap
        from backend.api.models import Colormap
        colormap, _ = Colormap.objects.get_or_create(name='viridis')

        analyses = []
        for nfft, spec_files in spectrograms_by_fft.items():
            # Create analysis name with FFT size
            analysis_name = f"{name} - FFT {nfft}"

            # Check if analysis already exists
            analysis = SpectrogramAnalysis.objects.filter(
                dataset=dataset,
                name=analysis_name
            ).first()

            if not analysis:
                # Get metadata from first spectrogram of this FFT size
                first_spec = spec_files[0]
                metadata = first_spec.metadata

                # Parse timestamps for the first file
                try:
                    start = datetime.fromisoformat(metadata['begin'].replace('+0000', '').replace('Z', ''))
                    if start.tzinfo is None:
                        from django.utils import timezone as django_timezone
                        start = django_timezone.make_aware(start, django_timezone.utc)
                except (ValueError, AttributeError, KeyError):
                    from django.utils import timezone as django_timezone
                    start = django_timezone.make_aware(datetime(1970, 1, 1), django_timezone.utc)

                # For end time, use the last spectrogram of this FFT size
                try:
                    last_spec = spec_files[-1]
                    last_metadata = last_spec.metadata
                    end = datetime.fromisoformat(last_metadata['end'].replace('+0000', '').replace('Z', ''))
                    if end.tzinfo is None:
                        from django.utils import timezone as django_timezone
                        end = django_timezone.make_aware(end, django_timezone.utc)
                except (ValueError, AttributeError, KeyError):
                    from django.utils import timezone as django_timezone
                    end = django_timezone.make_aware(datetime(1970, 1, 1), django_timezone.utc)

                # Create analysis for this FFT size
                analysis = SpectrogramAnalysis.objects.create(
                    dataset=dataset,
                    name=analysis_name,
                    path=path,  # Point to the dataset folder
                    owner=info.context.user,
                    start=start,
                    end=end,
                    sample_rate=metadata.get('sample_rate', 48000),
                    nfft=int(nfft),
                    hop_length=metadata.get('hop_length', 512),
                    duration=sum(s.metadata.get('duration', 0.0) for s in spec_files),
                    colormap=colormap,
                    dynamic_min=0.0,
                    dynamic_max=100.0,
                    frequency_min=metadata.get('frequency_min', 0.0),
                    frequency_max=metadata.get('frequency_max', 24000.0),
                )
                logger.info(f"Created analysis: {analysis_name}")

            analyses.append((analysis, spec_files))

        # Now import spectrograms and link them to their corresponding analyses
        from metadatax.data.models import FileFormat

        img_format, _ = FileFormat.objects.get_or_create(name='nc')
        total_imported = 0
        total_skipped = 0

        for analysis, spec_files in analyses:
            imported_count = 0
            skipped_count = 0

            for spec_file in spec_files:
                try:
                    spec_metadata = spec_file.metadata

                    # Parse timestamps
                    try:
                        spec_start = datetime.fromisoformat(spec_metadata['begin'].replace('+0000', '').replace('Z', ''))
                        if spec_start.tzinfo is None:
                            from django.utils import timezone as django_timezone
                            spec_start = django_timezone.make_aware(spec_start, django_timezone.utc)
                    except (ValueError, AttributeError, KeyError):
                        logger.warning(f"Could not parse start time for {spec_file.netcdf_path.name}")
                        continue

                    try:
                        spec_end = datetime.fromisoformat(spec_metadata['end'].replace('+0000', '').replace('Z', ''))
                        if spec_end.tzinfo is None:
                            from django.utils import timezone as django_timezone
                            spec_end = django_timezone.make_aware(spec_end, django_timezone.utc)
                    except (ValueError, AttributeError, KeyError):
                        logger.warning(f"Could not parse end time for {spec_file.netcdf_path.name}")
                        continue

                    filename = spec_file.netcdf_path.stem

                    # Check if spectrogram already exists
                    existing = Spectrogram.objects.filter(
                        filename=filename,
                        format=img_format,
                        start=spec_start,
                        end=spec_end
                    ).first()

                    if existing:
                        # Link to analysis if not already linked
                        if not existing.analysis.filter(id=analysis.id).exists():
                            existing.analysis.add(analysis)
                        skipped_count += 1
                        logger.debug(f"Spectrogram '{filename}' already exists, ensuring link to {analysis.name}")
                    else:
                        # Create new spectrogram
                        spectrogram = Spectrogram.objects.create(
                            filename=filename,
                            format=img_format,
                            start=spec_start,
                            end=spec_end
                        )
                        # Link to analysis
                        spectrogram.analysis.add(analysis)
                        imported_count += 1
                        logger.debug(f"Created spectrogram: {filename} for {analysis.name}")

                except Exception as e:
                    logger.error(f"Failed to import {spec_file.netcdf_path.name}: {e}")
                    # Continue with next file instead of failing completely
                    continue

            logger.info(
                f"Analysis '{analysis.name}': {imported_count} new spectrograms"
                + (f", {skipped_count} already existed" if skipped_count > 0 else "")
            )
            total_imported += imported_count
            total_skipped += skipped_count

        logger.info(
            f"Import complete: {len(analyses)} analyses created with {total_imported} new spectrograms"
            + (f", {total_skipped} already existed" if total_skipped > 0 else "")
        )

        message = (
            f"Successfully imported dataset '{name}' with {len(analyses)} analyses and {total_imported} spectrograms. "
            + (f"({total_skipped} already existed)" if total_skipped > 0 else "")
        )

        return ImportSimpleDatasetMutation(ok=True, message=message)
