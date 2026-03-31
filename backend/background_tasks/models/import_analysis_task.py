from django.db import models

from backend.api.models import Dataset, SpectrogramAnalysis
from ._enums import TaskType
from .background_task import BackgroundTask


class ImportAnalysisBackgroundTask(BackgroundTask):

    dataset = models.ForeignKey(
        Dataset,
        on_delete=models.CASCADE,
        related_name="import_analysis_background_tasks",
    )

    analysis_path = models.TextField()
    analysis = models.ForeignKey(
        SpectrogramAnalysis,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="import_analysis_background_tasks",
    )

    total_spectrograms = models.PositiveIntegerField(blank=True, null=True)
    completed_spectrograms = models.PositiveIntegerField(default=0)
    chunk_size = models.PositiveIntegerField(default=200)

    @property
    def type(self) -> TaskType:
        return TaskType.ANALYSIS_IMPORT

    def _get_ws_update_data_data_identification(self):
        return {
            **super()._get_ws_update_data_data_identification(),
            # Data relation
            "dataset_id": self.dataset_id,
            "analysis_path": self.analysis_path,
            "analysis_id": self.analysis_id,
        }

    def _get_ws_update_data_data_state_processing(self):
        return {
            **super()._get_ws_update_data_data_state_processing(),
            "total_spectrograms": self.total_spectrograms,
            "completed_spectrograms": self.completed_spectrograms,
            "chunk_size": self.chunk_size,
        }

    def copy(self) -> "ImportAnalysisBackgroundTask":
        return ImportAnalysisBackgroundTask.objects.create(
            dataset=self.dataset,
            analysis_path=self.analysis_path,
            analysis=self.analysis,
            requested_by=self.requested_by,
            chunk_size=self.chunk_size,
        )


__all__ = ["ImportAnalysisBackgroundTask"]
