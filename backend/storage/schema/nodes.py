from django_extension.schema.types import ExtendedEnumType
from graphene import ObjectType, NonNull, String, Field

from backend.api.schema.nodes import DatasetNode, SpectrogramAnalysisNode
from backend.storage.models import ImportStatus
from backend.storage.types import StorageAnalysis, StorageDataset, StorageFolder

__all__ = [
    "AnalysisStorageNode",
    "DatasetStorageNode",
    "FolderNode",
]


class ImportStatusEnum(ExtendedEnumType):
    class Meta:
        enum = ImportStatus

    Unavailable = "U"
    Available = "A"
    Partial = "P"
    Imported = "I"


class AnalysisStorageNode(ObjectType):
    name = NonNull(String)
    path = NonNull(String)
    import_status = NonNull(ImportStatusEnum)
    model = Field(SpectrogramAnalysisNode)
    error = String()
    stack = String()

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
