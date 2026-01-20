"""
Import simple dataset mutation for APLOSE

This mutation imports datasets in the new simple format:
- One folder containing WAV files and corresponding NetCDF spectrograms
- No complex OSEkit structure needed
"""

import logging
from pathlib import Path

from django.conf import settings
from django.db import transaction
from graphene import String, Boolean, Mutation
from graphql import GraphQLError

from backend.api.models import Dataset, SpectrogramAnalysis
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

        # Create SpectrogramAnalysis for each spectrogram file
        imported_count = 0
        skipped_count = 0

        for spec_file in simple_dataset.spectrograms:
            try:
                # Get metadata
                metadata = spec_file.metadata

                # Create unique name for this analysis (using NetCDF filename)
                analysis_name = spec_file.netcdf_path.stem

                # Check if analysis already exists
                if SpectrogramAnalysis.objects.filter(
                    dataset=dataset,
                    name=analysis_name
                ).exists():
                    logger.debug(f"Analysis '{analysis_name}' already exists, skipping")
                    skipped_count += 1
                    continue

                # Create SpectrogramAnalysis
                analysis = SpectrogramAnalysis.objects.create(
                    dataset=dataset,
                    name=analysis_name,
                    path=str(spec_file.netcdf_path.relative_to(settings.DATASET_IMPORT_FOLDER)),
                    start=metadata.get('begin', ''),
                    end=metadata.get('end', ''),
                    # Store additional metadata in a JSON field if needed
                    # For now, we'll just use the required fields
                )

                imported_count += 1
                logger.debug(f"Created analysis: {analysis_name}")

            except Exception as e:
                logger.error(f"Failed to import {spec_file.netcdf_path.name}: {e}")
                # Continue with next file instead of failing completely
                continue

        logger.info(
            f"Import complete: {imported_count} new analyses imported, "
            f"{skipped_count} already existed"
        )

        message = (
            f"Successfully imported dataset '{name}' with {imported_count} spectrograms. "
            f"({skipped_count} already existed)"
        )

        return ImportSimpleDatasetMutation(ok=True, message=message)
