from backend.api.models import SpectrogramAnalysis
from backend.background_tasks.models import BackgroundTask
from backend.storage.resolvers import Resolver
from ._tracker import Tracker


def process_analysis_import(task: BackgroundTask, tracker: Tracker):
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
    task.additional_info["total_spectrograms"] = len(spectrograms)
    chunk_size = task.additional_info["chunk_size"]

    for offset in range(0, len(spectrograms), chunk_size):
        print("working on chunk", offset)
        chunk = spectrograms[offset : offset + chunk_size]
        analysis.add_spectrograms(spectrograms=chunk)
        tracker.update(percentage=(offset + chunk_size - 1) / len(spectrograms))
