from django.conf import settings
from django.db.models import F, QuerySet
from django.db.models.functions import Concat

from backend.api.models import Dataset, SpectrogramAnalysis
from backend.aplose.models import User
from .osekit import LegacyOSEkitResolver
from .storage import StorageResolver

_all__ = ["ModelResolver"]


class ModelResolver:
    """Resolver class for api.Model related content"""

    @staticmethod
    def get(path: str):
        """Get model resolver"""
        return ModelResolver(storage=StorageResolver.get(), path=path)

    storage: StorageResolver
    path: str

    dataset: Dataset | None
    analysis: SpectrogramAnalysis

    def __init__(self, storage: StorageResolver, path: str):
        self.storage = storage
        self.path = storage.clean_path(path)

        self.dataset = self.get_dataset(self.path)
        self.analysis = self.get_analysis(self.path)

    def get_dataset(self, path: str) -> Dataset | None:
        """Get dataset model"""
        return Dataset.objects.filter(path=self.storage.format_path(path)).first()

    def get_analysis(self, path: str) -> SpectrogramAnalysis | None:
        """Get analysis model"""
        return (
            SpectrogramAnalysis.objects.annotate(
                complete_path=Concat(F("path"), F("dataset__path"))
            )
            .filter(complete_path=self.storage.format_path(path))
            .first()
        )

    def get_or_create_dataset(self, owner: User, path: str | None = None) -> Dataset:
        """Get or create dataset model"""
        path = path or self.path
        model = self.get_dataset(path)
        if not model:
            legacy_resolver = LegacyOSEkitResolver(path)
            model = Dataset.objects.create(
                name=self.storage.get_folder_name(path),
                path=self.storage.format_path(path),
                owner=owner,
                legacy=legacy_resolver.datasets is not None
                and len(legacy_resolver.datasets) > 0,
            )
        return model

    def create_analysis(
        self, owner: User, name: str, path: str | None = None
    ) -> SpectrogramAnalysis:
        """Get or create analysis model"""
        path = path or self.path
        dataset = self.get_dataset(path)
        path = ""
        if dataset.legacy:
            for a in LegacyOSEkitResolver(path).all_analysis or []:
                if self.storage.get_folder_name(a["relative_path"]) == name:
                    path = a["relative_path"]
        return SpectrogramAnalysis.objects.create(
            dataset=dataset, name=name, owner=owner, path=path
        )
