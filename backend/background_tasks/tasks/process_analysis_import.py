from typing import TypedDict

from django.db import close_old_connections
from django.forms import model_to_dict

from backend.api.models import SpectrogramAnalysis, FFT, Colormap
from backend.background_tasks.models import ImportAnalysisBackgroundTask, TaskStatus
from backend.storage.resolvers import Resolver
from ._tracker import Tracker


class AdditionalInfo(TypedDict):
    chunk_size: int
    total_spectrograms: int
    completed_spectrograms: int


def process_analysis_import(task: ImportAnalysisBackgroundTask, tracker: Tracker):

    if task.status == TaskStatus.COMPLETED:
        raise Exception("Cannot process completed task")
    if task.status == TaskStatus.FAILED:
        raise Exception("Cannot process failed task")
    if task.status == TaskStatus.CANCELLED:
        raise Exception("Cannot process cancelled task")

    resolver = Resolver(path=None)
    analysis = resolver._get_analysis(
        dataset=task.dataset, relative_path=task.analysis_path, detailed=True
    )

    if analysis.pk is None:
        # Create analysis object
        analysis.owner = task.requested_by
        analysis.dataset = task.dataset
        analysis.fft, _ = FFT.objects.get_or_create(**model_to_dict(analysis.fft))
        analysis.colormap, _ = Colormap.objects.get_or_create(
            name=analysis.colormap.name
        )
        analysis.save()
        resolver.create_legacy_configuration(analysis=analysis)

        # Update task
        task.analysis = analysis
        task.save()
        tracker.send_update()

    # Get spectrograms
    spectrograms = Resolver.get_all_spectrograms_for_analysis(analysis=analysis)
    task.total_spectrograms = len(spectrograms)
    task.save()
    tracker.send_update()

    start = task.completed_spectrograms
    for offset in range(start, len(spectrograms), task.chunk_size):
        chunk = spectrograms[offset : offset + task.chunk_size]
        analysis.add_spectrograms(spectrograms=chunk)

        completed = offset + len(chunk)
        task.completed_spectrograms = completed
        task.save()
        tracker.update(percentage=completed / len(spectrograms))
