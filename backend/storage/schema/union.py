import graphene

from .nodes import AnalysisStorageNode, DatasetStorageNode, FolderNode

__all__ = [
    "StorageUnion",
]


class StorageUnion(graphene.types.Union):
    class Meta:
        types = (
            AnalysisStorageNode,
            DatasetStorageNode,
            FolderNode,
        )
