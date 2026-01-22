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

        # Create ONE SpectrogramAnalysis for the entire dataset (not one per file!)
        # Use the first spectrogram to get metadata (FFT params, sample rate, etc.)
        analysis_name = f"{name} Analysis"

        # Check if analysis already exists
        analysis = SpectrogramAnalysis.objects.filter(
            dataset=dataset,
            name=analysis_name
        ).first()

        if not analysis:
            # Get metadata from first spectrogram file
            first_spec = simple_dataset.spectrograms[0]
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

            # For end time, use the last spectrogram
            try:
                last_spec = simple_dataset.spectrograms[-1]
                last_metadata = last_spec.metadata
                end = datetime.fromisoformat(last_metadata['end'].replace('+0000', '').replace('Z', ''))
                if end.tzinfo is None:
                    from django.utils import timezone as django_timezone
                    end = django_timezone.make_aware(end, django_timezone.utc)
            except (ValueError, AttributeError, KeyError):
                from django.utils import timezone as django_timezone
                end = django_timezone.make_aware(datetime(1970, 1, 1), django_timezone.utc)

            # Get or create default colormap
            from backend.api.models import Colormap
            colormap, _ = Colormap.objects.get_or_create(name='viridis')

            # Create ONE analysis for the entire dataset
            # Use the dataset folder path as the analysis path
            analysis = SpectrogramAnalysis.objects.create(
                dataset=dataset,
                name=analysis_name,
                path=path,  # Point to the dataset folder, not individual files
                owner=info.context.user,
                start=start,
                end=end,
                sample_rate=metadata.get('sample_rate', 48000),
                nfft=metadata.get('nfft', 2048),
                hop_length=metadata.get('hop_length', 512),
                duration=sum(s.metadata.get('duration', 0.0) for s in simple_dataset.spectrograms),
                colormap=colormap,
                dynamic_min=0.0,
                dynamic_max=100.0,
                frequency_min=metadata.get('frequency_min', 0.0),
                frequency_max=metadata.get('frequency_max', 24000.0),
            )
            logger.info(f"Created analysis: {analysis_name}")

        # Now import ALL spectrograms and link them to this ONE analysis
        from metadatax.data.models import FileFormat

        img_format, _ = FileFormat.objects.get_or_create(name='nc')
        imported_count = 0
        skipped_count = 0

        for spec_file in simple_dataset.spectrograms:
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
                    logger.debug(f"Spectrogram '{filename}' already exists, ensuring link")
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
                    logger.debug(f"Created spectrogram: {filename}")

            except Exception as e:
                logger.error(f"Failed to import {spec_file.netcdf_path.name}: {e}")
                # Continue with next file instead of failing completely
                continue

        logger.info(
            f"Import complete: 1 analysis created with {imported_count} new spectrograms"
            + (f", {skipped_count} already existed" if skipped_count > 0 else "")
        )

        message = (
            f"Successfully imported dataset '{name}' with 1 analysis and {imported_count} spectrograms. "
            + (f"({skipped_count} already existed)" if skipped_count > 0 else "")
        )

        return ImportSimpleDatasetMutation(ok=True, message=message)
