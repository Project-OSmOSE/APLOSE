import graphene

from .nodes import AnalysisStorageNode, DatasetStorageNode, FolderNode

__all__ = [
    "StorageUnion",
]

from .resolver.base_resolver import BaseResolver


class StorageUnion(graphene.types.Union):
    class Meta:
        types = (
            FolderNode,
            DatasetStorageNode,
            AnalysisStorageNode,
        )

    @classmethod
    def resolve_type(cls, instance: any, info):
        if isinstance(instance, BaseResolver):
            return type(instance.node)
        return super().resolve_type(instance, info)
