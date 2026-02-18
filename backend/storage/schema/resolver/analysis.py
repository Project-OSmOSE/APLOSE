from pathlib import PureWindowsPath
from typing import Optional

from django.conf import settings
from osekit.core_api.spectro_dataset import SpectroDataset

from backend.api.models import SpectrogramAnalysis as AnalysisModel
from .types import ImportStatus
from .base_resolver import BaseResolver
from .exceptions import AnalysisBrowseException
from ..nodes import AnalysisStorageNode


class Analysis(BaseResolver):

    dataset_path: str
    model: Optional[AnalysisModel]
    osekit: Optional[SpectroDataset]

    @property
    def name(self) -> str:
        if self.model:
            return self.model.name
        if self.osekit:
            return self.osekit.name
        return super().name

    @property
    def node(self):
        n = AnalysisStorageNode()
        n.name = self.name
        n.path = self.path
        n.import_status = self.import_status
        return n

    @property
    def import_status(self) -> bool:
        if self.model:
            return ImportStatus.Imported
        return ImportStatus.Available

    @property
    def relative_path(self) -> str:
        return self.path.split(self.dataset_path).pop().strip("/")

    def __init__(
        self,
        root=settings.DATASET_EXPORT_PATH,
        path: Optional[str] = None,
        dataset_path: Optional[str] = None,
        osekit: Optional[SpectroDataset] = None,
    ):
        super().__init__(root, path)
        self.dataset_path = dataset_path or ""
        self.model = AnalysisModel.objects.filter(
            dataset__path=self.dataset_path,
            path=self.relative_path,
        ).first()
        self.osekit = osekit

    def browse(self) -> list:
        raise AnalysisBrowseException


__all__ = [
    "Analysis",
]
