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
from datetime import datetime
from pathlib import Path

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from backend.api.models import Dataset, SpectrogramAnalysis, Spectrogram
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

        # Group spectrograms by FFT size to create separate analyses
        from collections import defaultdict
        spectrograms_by_fft = defaultdict(list)

        for spec_file in simple_dataset.spectrograms:
            nfft = spec_file.metadata.get('nfft', 2048)
            spectrograms_by_fft[nfft].append(spec_file)

        self.stdout.write('')
        self.stdout.write(self.style.MIGRATE_LABEL(
            f"Found {len(spectrograms_by_fft)} different FFT sizes: {list(spectrograms_by_fft.keys())}"
        ))
        self.stdout.write(self.style.MIGRATE_LABEL("Creating analysis configurations..."))
        self.stdout.write('')

        from backend.api.models.data.colormap import Colormap
        from django.utils import timezone as django_timezone

        colormap, _ = Colormap.objects.get_or_create(name='viridis')
        analyses = []

        for nfft, spec_files in spectrograms_by_fft.items():
            # Create analysis name with FFT size
            analysis_name = f"{dataset_name} - FFT {nfft}"

            analysis = SpectrogramAnalysis.objects.filter(
                dataset=dataset,
                name=analysis_name
            ).first()

            if not analysis:
                # Get metadata from first spectrogram of this FFT size
                first_spec = spec_files[0]
                metadata = first_spec.metadata

                # Parse timestamps
                try:
                    start = datetime.fromisoformat(metadata['begin'].replace('+0000', '').replace('Z', ''))
                    if start.tzinfo is None:
                        start = django_timezone.make_aware(start, django_timezone.utc)
                except (ValueError, AttributeError, KeyError):
                    start = django_timezone.make_aware(datetime(1970, 1, 1), django_timezone.utc)

                try:
                    last_spec = spec_files[-1]
                    last_metadata = last_spec.metadata
                    end = datetime.fromisoformat(last_metadata['end'].replace('+0000', '').replace('Z', ''))
                    if end.tzinfo is None:
                        end = django_timezone.make_aware(end, django_timezone.utc)
                except (ValueError, AttributeError, KeyError):
                    end = django_timezone.make_aware(datetime(1970, 1, 1), django_timezone.utc)

                analysis = SpectrogramAnalysis.objects.create(
                    dataset=dataset,
                    name=analysis_name,
                    path=folder_path,  # Dataset folder path
                    owner=owner,
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
                self.stdout.write(self.style.SUCCESS(f"✓ Created analysis: {analysis_name}"))
            else:
                self.stdout.write(self.style.WARNING(f"⚠ Analysis already exists: {analysis_name}"))

            analyses.append((analysis, spec_files))

        self.stdout.write('')
        self.stdout.write(self.style.MIGRATE_LABEL("Importing spectrograms..."))
        self.stdout.write('')

        # Import spectrograms and link to their corresponding analyses
        from metadatax.data.models import FileFormat
        img_format, _ = FileFormat.objects.get_or_create(name='nc')

        total_imported = 0
        total_skipped = 0
        total_errors = 0

        for analysis, spec_files in analyses:
            self.stdout.write(self.style.MIGRATE_HEADING(f"Processing {analysis.name}..."))

            imported_count = 0
            skipped_count = 0
            error_count = 0

            for i, spec_file in enumerate(spec_files, 1):
                try:
                    spec_metadata = spec_file.metadata
                    from django.utils import timezone as django_timezone

                    try:
                        spec_start = datetime.fromisoformat(spec_metadata['begin'].replace('+0000', '').replace('Z', ''))
                        if spec_start.tzinfo is None:
                            spec_start = django_timezone.make_aware(spec_start, django_timezone.utc)
                    except (ValueError, AttributeError, KeyError):
                        raise ValueError(f"Could not parse start time")

                    try:
                        spec_end = datetime.fromisoformat(spec_metadata['end'].replace('+0000', '').replace('Z', ''))
                        if spec_end.tzinfo is None:
                            spec_end = django_timezone.make_aware(spec_end, django_timezone.utc)
                    except (ValueError, AttributeError, KeyError):
                        raise ValueError(f"Could not parse end time")

                    # Use base filename without FFT suffix for consistency
                    # For multi-FFT files, all FFT sizes share the same base filename
                    filename = spec_file.netcdf_path.stem

                    # Check if exists (need to check by filename, start, end to avoid duplicates)
                    existing = Spectrogram.objects.filter(
                        filename=filename,
                        format=img_format,
                        start=spec_start,
                        end=spec_end
                    ).first()

                    if existing:
                        if not existing.analysis.filter(id=analysis.id).exists():
                            existing.analysis.add(analysis)
                        self.stdout.write(
                            f"  [{i}/{len(spec_files)}] "
                            f"{filename} - "
                            f"{self.style.WARNING('already exists')}"
                        )
                        skipped_count += 1
                    else:
                        spectrogram = Spectrogram.objects.create(
                            filename=filename,
                            format=img_format,
                            start=spec_start,
                            end=spec_end
                        )
                        spectrogram.analysis.add(analysis)
                        self.stdout.write(
                            f"  [{i}/{len(spec_files)}] "
                            f"{filename} - "
                            f"{self.style.SUCCESS('imported')}"
                        )
                        imported_count += 1

                except Exception as e:
                    self.stdout.write(
                        f"  [{i}/{len(spec_files)}] "
                        f"{spec_file.netcdf_path.name} - "
                        f"{self.style.ERROR(f'error: {str(e)}')}"
                    )
                    error_count += 1
                    continue

            self.stdout.write(
                f"  {self.style.MIGRATE_LABEL(f'Analysis summary:')} "
                f"{self.style.SUCCESS(f'{imported_count} imported')}, "
                f"{self.style.WARNING(f'{skipped_count} skipped')}, "
                f"{self.style.ERROR(f'{error_count} errors')}"
            )
            self.stdout.write('')

            total_imported += imported_count
            total_skipped += skipped_count
            total_errors += error_count

        self.stdout.write('')
        self.stdout.write(self.style.MIGRATE_HEADING('='*70))
        self.stdout.write(self.style.MIGRATE_HEADING('Import Summary'))
        self.stdout.write(self.style.MIGRATE_HEADING('='*70))
        self.stdout.write('')
        self.stdout.write(f"Dataset: {dataset_name} (ID: {dataset.id})")
        self.stdout.write(f"Analyses created: {len(analyses)}")
        for analysis, spec_files in analyses:
            self.stdout.write(f"  - {analysis.name} (ID: {analysis.id}): {len(spec_files)} spectrograms")
        self.stdout.write('')
        self.stdout.write(f"Total spectrogram files found: {len(simple_dataset.spectrograms)}")
        self.stdout.write(self.style.SUCCESS(f"✓ Newly imported: {total_imported}"))
        if total_skipped > 0:
            self.stdout.write(self.style.WARNING(f"⚠ Already existed: {total_skipped}"))
        if total_errors > 0:
            self.stdout.write(self.style.ERROR(f"✗ Errors: {total_errors}"))
        self.stdout.write('')

        if total_imported > 0:
            self.stdout.write(self.style.SUCCESS(
                "✓ Import completed successfully! "
                "You can now create an annotation campaign with this dataset."
            ))
        elif total_skipped > 0 and total_errors == 0:
            self.stdout.write(self.style.WARNING(
                "⚠ All spectrograms already existed. Dataset is up to date."
            ))
        else:
            self.stdout.write(self.style.ERROR(
                "✗ Import failed. Check the errors above."
            ))
