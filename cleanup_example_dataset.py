#!/usr/bin/env python
"""
Script to completely clean up the Example Dataset and all related data.
Run this inside the Docker container to fix the ID mismatch issue.

Usage:
    docker compose --env-file test.env exec osmose_back poetry run python cleanup_example_dataset.py
"""

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from backend.api.models import (
    Dataset,
    SpectrogramAnalysis,
    Spectrogram,
    AnnotationCampaign,
    AnnotationFileRange,
    AnnotationTask,
    AnnotationPhase,
)

def cleanup_example_dataset():
    """Clean up all data related to Example Dataset"""

    print("=" * 70)
    print("CLEANUP: Example Dataset")
    print("=" * 70)
    print()

    # Find the dataset
    dataset = Dataset.objects.filter(name__icontains="Example").first()

    if not dataset:
        print("❌ No Example Dataset found. Nothing to clean up.")
        return

    print(f"Found dataset: {dataset.name} (ID: {dataset.id})")
    print()

    # 1. Show what will be deleted
    print("=" * 70)
    print("DATA TO BE DELETED:")
    print("=" * 70)

    analyses = SpectrogramAnalysis.objects.filter(dataset=dataset)
    print(f"📊 Analyses: {analyses.count()}")
    for a in analyses:
        print(f"   - {a.name} (ID: {a.id})")

    spectrograms = Spectrogram.objects.filter(analysis__dataset=dataset)
    print(f"📈 Spectrograms: {spectrograms.count()}")
    for s in spectrograms:
        print(f"   - {s.filename} (ID: {s.id})")

    campaigns = AnnotationCampaign.objects.filter(dataset=dataset)
    print(f"📝 Annotation Campaigns: {campaigns.count()}")
    for c in campaigns:
        print(f"   - {c.name} (ID: {c.id})")

    phases = AnnotationPhase.objects.filter(annotation_campaign__dataset=dataset)
    print(f"🔄 Annotation Phases: {phases.count()}")

    file_ranges = AnnotationFileRange.objects.filter(
        annotation_phase__annotation_campaign__dataset=dataset
    )
    print(f"📋 Annotation File Ranges: {file_ranges.count()}")

    tasks = AnnotationTask.objects.filter(
        annotation_phase__annotation_campaign__dataset=dataset
    )
    print(f"✅ Annotation Tasks: {tasks.count()}")

    print()
    print("=" * 70)

    # 2. Ask for confirmation
    response = input("⚠️  Delete ALL this data? (yes/no): ")

    if response.lower() != 'yes':
        print("❌ Cancelled. No data deleted.")
        return

    print()
    print("=" * 70)
    print("DELETING DATA...")
    print("=" * 70)

    # 3. Delete in correct order (respecting foreign keys)

    # Delete annotation tasks first
    task_count = tasks.count()
    tasks.delete()
    print(f"✓ Deleted {task_count} annotation tasks")

    # Delete file ranges
    range_count = file_ranges.count()
    file_ranges.delete()
    print(f"✓ Deleted {range_count} file ranges")

    # Delete phases
    phase_count = phases.count()
    phases.delete()
    print(f"✓ Deleted {phase_count} phases")

    # Delete campaigns
    campaign_count = campaigns.count()
    campaigns.delete()
    print(f"✓ Deleted {campaign_count} campaigns")

    # Delete spectrograms (many-to-many relationship with analyses)
    spectrogram_count = spectrograms.count()
    spectrograms.delete()
    print(f"✓ Deleted {spectrogram_count} spectrograms")

    # Delete analyses
    analysis_count = analyses.count()
    analyses.delete()
    print(f"✓ Deleted {analysis_count} analyses")

    # Delete dataset
    dataset.delete()
    print(f"✓ Deleted dataset: {dataset.name}")

    print()
    print("=" * 70)
    print("✅ CLEANUP COMPLETE!")
    print("=" * 70)
    print()
    print("Next steps:")
    print("1. Re-import the dataset:")
    print("   docker compose --env-file test.env exec osmose_back poetry run \\")
    print("     python manage.py import_simple_dataset example --name 'Example Dataset'")
    print()
    print("2. Create a new annotation campaign through the web interface")
    print()

if __name__ == '__main__':
    cleanup_example_dataset()
