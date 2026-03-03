from typing import Optional

import graphene
from django_extension.schema.permissions import GraphQLResolve, GraphQLPermissions
from graphql import GraphQLError

from backend.storage.types import Folder, StorageDataset, StorageAnalysis
from .search import resolve_search, get_node
from ..union import StorageUnion


@GraphQLResolve(permission=GraphQLPermissions.STAFF_OR_SUPERUSER)
def resolve_browse(root, info, path: Optional[str] = None):
    """Get all datasets for import"""
    current_node, model, osekit, storage = get_node(path)

    if isinstance(current_node, StorageAnalysis):
        raise GraphQLError(f"Analysis has no inner nodes: {path}")
    if isinstance(current_node, StorageDataset):
        return [
            osekit.get_storage_analysis(analysis) for analysis in osekit.all_analysis
        ]
    if isinstance(current_node, Folder):
        return [
            resolve_search(root, info, path=path) for path in storage.list_folders(path)
        ]
    return []


BrowseField = graphene.Field(
    graphene.List(
        StorageUnion,
    ),
    path=graphene.String(),
    resolver=resolve_browse,
)
__all__ = ["BrowseField"]
