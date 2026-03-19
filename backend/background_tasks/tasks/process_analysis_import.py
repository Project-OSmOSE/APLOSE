from typing import TypedDict

from backend.api.models import SpectrogramAnalysis
from backend.background_tasks.models import BackgroundTask
from backend.storage.resolvers import Resolver
from ._tracker import Tracker


class AdditionalInfo(TypedDict):
    chunk_size: int
    total_spectrograms: int
    completed_spectrograms: int


def process_analysis_import(task: BackgroundTask, tracker: Tracker):
    def task_update(info: AdditionalInfo):
        task.additional_info = info
        task.save()
        return info

    info: AdditionalInfo = task.additional_info

    try:
        analysis = SpectrogramAnalysis.objects.get(
            pk=task.additional_info.get("analysis_id")
        )
    except SpectrogramAnalysis.DoesNotExist as e:
        tracker.fail(exception=e)
        return

    spectrograms = Resolver(path=None).get_all_spectrograms_for_analysis(
        analysis=analysis
    )

    info["total_spectrograms"] = len(spectrograms)
    if "chunk_size" not in info or info["chunk_size"] is None:
        info["chunk_size"] = 200
    task_update(info)
    start = 0
    if "completed_spectrograms" in info:
        start = info.get("completed_spectrograms") + 1

    for offset in range(start, len(spectrograms), info["chunk_size"]):
        chunk = spectrograms[offset : offset + info["chunk_size"]]
        analysis.add_spectrograms(spectrograms=chunk)

        completed = offset + info["chunk_size"] - 1
        info["completed_spectrograms"] = completed
        task_update(info)
        tracker.update(percentage=completed / len(spectrograms))
