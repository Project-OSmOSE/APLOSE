from django.db.models import F, QuerySet
from django.db.models.functions import Concat

from backend.api.models import Dataset, SpectrogramAnalysis
from backend.storage.types import (
    StorageAnalysis,
    ImportStatus,
    StorageDataset,
    StorageFolder,
    StorageItem,
)
from ._abstract import AbstractResolver
from ._osekit import OSEkitResolver
from ..exceptions import CannotGetChildrenException
from ..utils import make_path_relative
from ...utils.osekit_replace import SpectroDataset


class ModelResolver(AbstractResolver):

    __osekit: OSEkitResolver

    __dataset: type[Dataset] | None
    __analysis: type[SpectrogramAnalysis] | None

    def __init__(self, osekit: OSEkitResolver):
        self.__osekit = osekit
        super().__init__(osekit.path)

        self.__dataset = self.__get_dataset_model()
        self.__analysis = self.__get_analysis_model()

    def __get_dataset_model(self, path: str | None = None) -> type[Dataset] | None:
        return Dataset.objects.filter(path=path or self.path).first()

    def __get_all_analysis_model(
        self, path: str | None = None
    ) -> QuerySet[SpectrogramAnalysis] | None:
        return SpectrogramAnalysis.objects.annotate(
            complete_path=Concat(F("path"), F("dataset__path"))
        ).filter(dataset=self.__get_dataset_model(path) if path else self.__dataset)

    def __get_analysis_model(
        self, path: str | None = None
    ) -> type[SpectrogramAnalysis] | None:
        return (
            self.__get_all_analysis_model(path)
            .filter(complete_path=path or self.path)
            .first()
        )

    def get_dataset(self, path: str | None = None) -> StorageDataset | StorageFolder:
        if path is None:
            dataset = self.__dataset
        else:
            dataset = self.__get_dataset_model(path)

        if dataset is None:
            return self.__osekit.get_dataset(path)

        status = ImportStatus.Imported
        for spectro_dataset in self.__osekit.get_all_spectro_dataset(path):
            if (
                not self.__get_all_analysis_model(path)
                .filter(complete_path=make_path_relative(spectro_dataset.folder))
                .exists()
            ):
                status = ImportStatus.Partial
                break

        return StorageDataset(
            name=self.__dataset.name,
            path=self.__dataset.path,
            import_status=status,
            model=self.__dataset,
        )

    def get_analysis(
        self,
        path: str | None = None,
        analysis: SpectrogramAnalysis | None = None,
        spectro_dataset: SpectroDataset | None = None,
    ) -> StorageAnalysis | None:
        __analysis = self.__analysis
        if path:
            __analysis = self.__get_analysis_model(path=path)
        elif analysis:
            __analysis = analysis
        analysis = __analysis

        if analysis is None:
            return self.__osekit.get_analysis(spectro_dataset)

        return StorageAnalysis(
            name=analysis.name,
            path=analysis.path,
            import_status=ImportStatus.Imported,
            model=analysis,
        )

    def get_child_items(self, path: str | None = None) -> list[StorageItem]:
        if path:
            analysis = self.__get_analysis_model(path=path)
            dataset = self.__get_dataset_model(path=path)
        else:
            analysis = self.__analysis
            dataset = self.__dataset

        if analysis:
            raise CannotGetChildrenException(self.path)

        qs = self.__get_all_analysis_model(path)
        if dataset:
            all_analysis: list[StorageAnalysis] = []
            for sd in self.__osekit.get_all_spectro_dataset():
                osekit_storage_analysis = self.__osekit.get_analysis(sd)
                known = qs.filter(path=osekit_storage_analysis.path).first()
                all_analysis.append(
                    self.get_analysis(analysis=known, spectro_dataset=sd)
                )
            return all_analysis

        return self.__osekit.get_child_items()
