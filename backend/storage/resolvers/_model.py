from backend.api.models import (
    Dataset,
    SpectrogramAnalysis,
    Spectrogram,
)
from backend.storage.models import ImportStatus
from backend.storage.types import (
    StorageAnalysis,
    StorageDataset,
    FailedItem,
)
from backend.storage.utils import exists, join
from ._osekit import OSEkitResolver


class ModelResolver(OSEkitResolver):
    def _get_dataset_for_path(
        self, path: str | None = None
    ) -> Dataset | FailedItem | None:
        return Dataset.objects.filter(
            path=path
        ).first() or super()._get_dataset_for_path(path=path)

    def _get_all_analysis_for_dataset(
        self, dataset: Dataset, detailed: bool = False
    ) -> list[SpectrogramAnalysis | FailedItem]:
        analysis = []

        if dataset.pk:
            for a in dataset.spectrogram_analysis.all():
                if exists(join(dataset.path, a.path)):
                    analysis.append(a)

        for a in super()._get_all_analysis_for_dataset(
            dataset=dataset, detailed=detailed
        ):
            if (
                not dataset.pk
                or not dataset.spectrogram_analysis.filter(path=a.path).exists()
            ):
                analysis.append(a)

        return analysis

    def _get_analysis(
        self, dataset: Dataset, relative_path: str, detailed: bool = False
    ) -> SpectrogramAnalysis | FailedItem:
        if dataset.pk:
            if dataset.spectrogram_analysis.filter(path=relative_path).exists():
                return dataset.spectrogram_analysis.get(path=relative_path)
        return super()._get_analysis(
            dataset=dataset, relative_path=relative_path, detailed=detailed
        )

    def _get_storage_analysis_from_spectrogram_analysis(
        self, analysis: SpectrogramAnalysis
    ) -> StorageAnalysis:
        return StorageAnalysis(
            path=analysis.path,
            name=analysis.name,
            import_status=ImportStatus.IMPORTED
            if analysis.pk
            else ImportStatus.AVAILABLE,
            model=analysis if analysis.pk else None,
        )

    def _get_storage_dataset_from_dataset(self, dataset: Dataset) -> StorageDataset:
        status = ImportStatus.IMPORTED
        if dataset.pk is None:
            status = ImportStatus.AVAILABLE
        else:
            for analysis in self.get_all_analysis(path=dataset.path):
                if analysis.pk is None:
                    status = ImportStatus.PARTIAL
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
