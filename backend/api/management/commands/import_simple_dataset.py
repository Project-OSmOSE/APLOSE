"""
Django management command to import simple NetCDF datasets

Usage:
    python manage.py import_simple_dataset <folder_path> [--name <dataset_name>] [--user <username>]

Examples:
    # Import with automatic name from folder
    python manage.py import_simple_dataset example_marine_mammals

    # Import with custom name
    python manage.py import_simple_dataset example_marine_mammals --name "Marine Mammals 2024"

    # Import specifying owner
    python manage.py import_simple_dataset example_marine_mammals --user admin
"""

import logging
from pathlib import Path

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from backend.api.models import Dataset, SpectrogramAnalysis
from backend.utils.spectrogram.dataset import SimpleDataset

User = get_user_model()
logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Import a simple NetCDF dataset (WAV + NetCDF pairs in one folder)'

    def add_arguments(self, parser):
        parser.add_argument(
            'folder',
            type=str,
            help='Folder name or relative path from DATASET_IMPORT_FOLDER containing WAV and NetCDF files'
        )
        parser.add_argument(
            '--name',
            type=str,
            help='Dataset display name (defaults to folder name)',
            default=None
        )
        parser.add_argument(
            '--user',
            type=str,
            help='Username of the owner (defaults to first superuser)',
            default=None
        )

    @transaction.atomic
    def handle(self, *args, **options):
        folder_path = options['folder']
        dataset_name = options['name'] or folder_path
        username = options['user']

        self.stdout.write(self.style.MIGRATE_HEADING('='*70))
        self.stdout.write(self.style.MIGRATE_HEADING('APLOSE Simple Dataset Import'))
        self.stdout.write(self.style.MIGRATE_HEADING('='*70))
        self.stdout.write('')

        # Get owner user
        if username:
            try:
                owner = User.objects.get(username=username)
                self.stdout.write(f"Owner: {owner.username}")
            except User.DoesNotExist:
                raise CommandError(f"User '{username}' does not exist")
        else:
            # Use first superuser
            owner = User.objects.filter(is_superuser=True).first()
            if not owner:
                raise CommandError(
                    "No superuser found. Please create a superuser first with:\n"
                    "  python manage.py createsuperuser\n"
                    "Or specify a user with --user <username>"
                )
            self.stdout.write(f"Owner: {owner.username} (first superuser)")

        self.stdout.write(f"Dataset name: {dataset_name}")
        self.stdout.write(f"Folder path: {folder_path}")
        self.stdout.write('')

        # Get full path to dataset folder
        dataset_folder = settings.DATASET_IMPORT_FOLDER / folder_path

        if not dataset_folder.exists():
            raise CommandError(
                f"Dataset folder not found: {dataset_folder}\n"
                f"Expected location: {settings.DATASET_IMPORT_FOLDER}/{folder_path}\n"
                f"Current DATASET_IMPORT_FOLDER: {settings.DATASET_IMPORT_FOLDER}"
            )

        if not dataset_folder.is_dir():
            raise CommandError(f"Path is not a directory: {dataset_folder}")

        self.stdout.write(self.style.SUCCESS(f"✓ Found dataset folder: {dataset_folder}"))

        # Try to load as SimpleDataset
        try:
            simple_dataset = SimpleDataset(dataset_folder)
        except Exception as e:
            raise CommandError(f"Failed to load dataset: {str(e)}")

        # Check if dataset has spectrograms
        if not simple_dataset.spectrograms:
            raise CommandError(
                f"No NetCDF spectrograms found in {dataset_folder}\n"
                "Please generate spectrograms first using:\n"
                "  python -m backend.utils.spectrogram.cli generate <folder>\n"
                "Or see documentation: GETTING_STARTED_SIMPLE_NETCDF.md"
            )

        self.stdout.write(self.style.SUCCESS(
            f"✓ Found {len(simple_dataset.spectrograms)} NetCDF spectrograms"
        ))
        self.stdout.write('')

        # Create or get Dataset record
        # Note: Dataset has a custom manager with specific signature
        dataset, created = Dataset.objects.get_or_create(
            name=dataset_name,
            path=folder_path,
            owner=owner
        )

        if created:
            self.stdout.write(self.style.SUCCESS(f"✓ Created new dataset: {dataset_name}"))
        else:
            self.stdout.write(self.style.WARNING(
                f"⚠ Dataset '{dataset_name}' already exists, updating analyses"
            ))

        self.stdout.write('')
        self.stdout.write(self.style.MIGRATE_LABEL("Importing spectrograms..."))
        self.stdout.write('')

        # Create SpectrogramAnalysis for each spectrogram file
        imported_count = 0
        skipped_count = 0
        error_count = 0

        for i, spec_file in enumerate(simple_dataset.spectrograms, 1):
            try:
                # Create unique name for this analysis (using NetCDF filename)
                analysis_name = spec_file.netcdf_path.stem

                # Check if analysis already exists
                if SpectrogramAnalysis.objects.filter(
                    dataset=dataset,
                    name=analysis_name
                ).exists():
                    self.stdout.write(
                        f"  [{i}/{len(simple_dataset.spectrograms)}] "
                        f"{analysis_name} - "
                        f"{self.style.WARNING('already exists, skipping')}"
                    )
                    skipped_count += 1
                    continue

                # Get relative path from DATASET_IMPORT_FOLDER
                relative_path = str(spec_file.netcdf_path.relative_to(settings.DATASET_IMPORT_FOLDER))

                # Use manager method to create analysis
                analysis = SpectrogramAnalysis.objects.import_for_dataset(
                    dataset=dataset,
                    name=analysis_name,
                    path=relative_path,
                    owner=owner
                )

                self.stdout.write(
                    f"  [{i}/{len(simple_dataset.spectrograms)}] "
                    f"{analysis_name} - "
                    f"{self.style.SUCCESS('imported')}"
                )
                imported_count += 1

            except Exception as e:
                self.stdout.write(
                    f"  [{i}/{len(simple_dataset.spectrograms)}] "
                    f"{spec_file.netcdf_path.name} - "
                    f"{self.style.ERROR(f'error: {str(e)}')}"
                )
                error_count += 1
                # Continue with next file instead of failing completely
                continue

        self.stdout.write('')
        self.stdout.write(self.style.MIGRATE_HEADING('='*70))
        self.stdout.write(self.style.MIGRATE_HEADING('Import Summary'))
        self.stdout.write(self.style.MIGRATE_HEADING('='*70))
        self.stdout.write('')
        self.stdout.write(f"Dataset: {dataset_name} (ID: {dataset.id})")
        self.stdout.write(f"Total spectrograms found: {len(simple_dataset.spectrograms)}")
        self.stdout.write(self.style.SUCCESS(f"✓ Newly imported: {imported_count}"))
        if skipped_count > 0:
            self.stdout.write(self.style.WARNING(f"⚠ Already existed: {skipped_count}"))
        if error_count > 0:
            self.stdout.write(self.style.ERROR(f"✗ Errors: {error_count}"))
        self.stdout.write('')

        if imported_count > 0:
            self.stdout.write(self.style.SUCCESS(
                "✓ Import completed successfully! "
                "You can now create an annotation campaign with this dataset."
            ))
        elif skipped_count > 0 and error_count == 0:
            self.stdout.write(self.style.WARNING(
                "⚠ All spectrograms already existed. Dataset is up to date."
            ))
        else:
            self.stdout.write(self.style.ERROR(
                "✗ Import failed. Check the errors above."
            ))
