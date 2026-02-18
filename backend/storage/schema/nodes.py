from graphene import ObjectType, NonNull, String, Enum
from .resolver import ImportStatus

__all__ = [
    "AnalysisStorageNode",
    "DatasetStorageNode",
    "FolderNode",
]


class AnalysisStorageNode(ObjectType):
    name = NonNull(String)
    path = NonNull(String)
    import_status = NonNull(Enum.from_enum(enum=ImportStatus))


class DatasetStorageNode(ObjectType):
    name = NonNull(String)
    path = NonNull(String)
    import_status = NonNull(Enum.from_enum(enum=ImportStatus))


class FolderNode(ObjectType):
    name = NonNull(String)
    path = NonNull(String)
