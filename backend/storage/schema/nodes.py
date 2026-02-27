from typing import Optional

from graphene import ObjectType, NonNull, String, Enum, Field, Boolean

from backend.api.models import SpectrogramAnalysis, Dataset
from backend.api.schema import DatasetNode, SpectrogramAnalysisNode
from .resolver.types import ImportStatus

__all__ = [
    "AnalysisStorageNode",
    "DatasetStorageNode",
    "FolderNode",
]


class AnalysisStorageNode(ObjectType):
    name = NonNull(String)
    path = NonNull(String)
    import_status = NonNull(Enum.from_enum(enum=ImportStatus))
    model = Field(SpectrogramAnalysisNode)

    def __init__(
        self,
        name: str,
        path: str,
        import_status=ImportStatus.Available,
        model: SpectrogramAnalysis = None,
    ):
        self.name = name
        self.path = path
        self.import_status = import_status
        self.model = model

    @staticmethod
    def from_model(model: SpectrogramAnalysis):
        return AnalysisStorageNode(
            name=model.name,
            path=model.path,
            import_status=ImportStatus.Imported,
            model=model,
        )


class DatasetStorageNode(ObjectType):
    name = NonNull(String)
    path = NonNull(String)
    import_status = NonNull(Enum.from_enum(enum=ImportStatus))
    model = Field(DatasetNode)

    def __init__(
        self,
        name: str,
        path: str,
        import_status=ImportStatus.Available,
        model: Dataset = None,
    ):
        self.name = name
        self.path = path
        self.import_status = import_status
        self.model = model

    @staticmethod
    def from_model(model: Dataset, import_status: ImportStatus):
        return DatasetStorageNode(
            name=model.name,
            path=model.path,
            import_status=import_status,
            model=model,
        )


class FolderNode(ObjectType):
    name = NonNull(String)
    path = NonNull(String)

    def __init__(self, name: str, path: str):
        self.name = name
        self.path = path
