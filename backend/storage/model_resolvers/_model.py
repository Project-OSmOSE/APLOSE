from backend.api.models import (
    Dataset,
    SpectrogramAnalysis,
    Spectrogram,
)
from backend.storage.types import (
    StorageAnalysis,
    ImportStatus,
    StorageDataset,
    FailedItem,
)
from ._osekit import OSEkitResolver


class ModelResolver(OSEkitResolver):
    def _get_dataset_for_path(
        self, path: str | None = None
    ) -> Dataset | FailedItem | None:
        return Dataset.objects.filter(
            path=path
        ).first() or super()._get_dataset_for_path(path=path)

    def _get_all_analysis_for_dataset(
        self, dataset: Dataset
    ) -> list[SpectrogramAnalysis | FailedItem]:
        analysis = []
        for data in super()._get_all_analysis_for_dataset(dataset=dataset):
            a = SpectrogramAnalysis.objects.filter(path=data.path).first()
            if a:
                analysis.append(a)
            else:
                analysis.append(data)
        return analysis

    def _get_storage_analysis_from_spectrogram_analysis(
        self, analysis: SpectrogramAnalysis
    ) -> StorageAnalysis:
        return StorageAnalysis(
            path=analysis.path,
            name=analysis.name,
            import_status=ImportStatus.Imported
            if analysis.pk
            else ImportStatus.Available,
            model=analysis if analysis.pk else None,
        )

    def _get_storage_dataset_from_dataset(self, dataset: Dataset) -> StorageDataset:
        status = ImportStatus.Imported
        if dataset.pk is None:
            status = ImportStatus.Available
        else:
            for analysis in self.get_all_analysis(path=dataset.path):
                if analysis.pk is None:
                    status = ImportStatus.Partial
                    break
        return StorageDataset(
            name=dataset.name,
            path=dataset.path,
            import_status=status,
            model=dataset if dataset.pk else None,
        )

    def get_all_spectrograms_for_analysis(
        self, analysis: SpectrogramAnalysis
    ) -> list[Spectrogram]:
        return [
            *analysis.spectrograms.all(),
            *super().get_all_spectrograms_for_analysis(analysis=analysis),
        ]
