from typing import TypedDict, cast

from django.forms import model_to_dict

from backend.api.models import FFT, Colormap, Dataset
from backend.background_tasks.types import (
    ImportAnalysisInfo,
    ImportAnalysisBackgroundTask,
)
from backend.storage.resolvers import Resolver
from backend.storage.utils import make_path_relative
from ._tracker import Tracker


class AdditionalInfo(TypedDict):
    chunk_size: int
    total_spectrograms: int
    completed_spectrograms: int


def process_analysis_import(task: ImportAnalysisBackgroundTask, tracker: Tracker):
    info = task.other_info

    def update_info():
        task.other_info = cast(ImportAnalysisInfo, cast(object, dict(info)))
        task.save()
        tracker.send_update()

    resolver = Resolver(path=None)
    dataset = Dataset.objects.get(pk=info["dataset_id"])
    analysis = resolver._get_analysis(
        dataset=dataset,
        relative_path=make_path_relative(info["analysis_path"], to=dataset.path),
        detailed=True,
    )

    if analysis.pk is None:
        # Create analysis object
        analysis.owner = task.requested_by
        analysis.dataset = dataset
        analysis.fft, _ = FFT.objects.get_or_create(**model_to_dict(analysis.fft))
        analysis.colormap, _ = Colormap.objects.get_or_create(
            name=analysis.colormap.name
        )
        analysis.save()
        resolver.create_legacy_configuration(analysis=analysis)

        # Update task
        info["analysis_id"] = analysis.id
        update_info()

    # Get spectrograms
    spectrograms = Resolver.get_all_spectrograms_for_analysis(analysis=analysis)
    info["total_spectrograms"] = len(spectrograms)
    update_info()

    start = info["completed_spectrograms"]
    for offset in range(start, len(spectrograms), info["chunk_size"]):
        chunk = spectrograms[offset : offset + info["chunk_size"]]
        analysis.add_spectrograms(spectrograms=chunk)

        completed = offset + len(chunk)
        info["completed_spectrograms"] = completed
        task.completion_percentage = completed / len(spectrograms)
        update_info()

    analysis.is_import_completed = True
    analysis.save()
