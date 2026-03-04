from graphene import ObjectType, NonNull, String, Enum, Field

from backend.api.schema.nodes import DatasetNode, SpectrogramAnalysisNode
from ..types import ImportStatus, StorageAnalysis, StorageDataset, StorageFolder

__all__ = [
    "AnalysisStorageNode",
    "DatasetStorageNode",
    "FolderNode",
]

ImportStatusEnum = Enum.from_enum(enum=ImportStatus)


class AnalysisStorageNode(ObjectType):
    name = NonNull(String)
    path = NonNull(String)
    import_status = NonNull(ImportStatusEnum)
    model = Field(SpectrogramAnalysisNode)

    class Meta:
        possible_types = (StorageAnalysis,)


class DatasetStorageNode(ObjectType):
    name = NonNull(String)
    path = NonNull(String)
    import_status = NonNull(ImportStatusEnum)
    model = Field(DatasetNode)
    error = String()
    stack = String()

    class Meta:
        possible_types = (StorageDataset,)


class FolderNode(ObjectType):
    name = NonNull(String)
    path = NonNull(String)
    error = String()
    stack = String()

    class Meta:
        possible_types = (StorageFolder,)
