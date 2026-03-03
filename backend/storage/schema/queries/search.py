from pathlib import PureWindowsPath
from typing import Tuple

import graphene
from django_extension.schema.permissions import GraphQLResolve, GraphQLPermissions
from graphql import GraphQLError

from backend.storage.exceptions import InvalidFolderException
from backend.storage.resolvers import (
    StorageResolver,
    ModelResolver,
    OSEkitResolver,
    AbstractOSEkitResolver,
)
from backend.storage.types import StorageDataset, StorageAnalysis, Folder
from ..union import StorageUnion


def get_node(
    path: str,
) -> Tuple[
    Folder | StorageDataset | StorageAnalysis,
    ModelResolver,
    AbstractOSEkitResolver,
    StorageResolver,
]:
    storage = StorageResolver.get()
    path = storage.clean_path(path)
    if PureWindowsPath(path).anchor:
        # If the path as an anchor (is root), we shouldn't resolve
        raise GraphQLError(f"You should request non route path: {path}")

    if not storage.exists(path):
        raise GraphQLError(f"Path not found: {path}")
    try:
        model = ModelResolver.get(path)
        osekit = OSEkitResolver.get(path)

        return (
            (
                model.get_storage_analysis()
                or osekit.get_storage_analysis()
                or model.get_storage_dataset()
                or osekit.get_storage_dataset()
                or storage.get_folder(path)
            ),
            model,
            osekit,
            storage,
        )
    except InvalidFolderException as e:
        raise GraphQLError(str(e), original_error=e)


@GraphQLResolve(permission=GraphQLPermissions.STAFF_OR_SUPERUSER)
def resolve_search(root, info, path: str):
    """Get all datasets for import"""
    return get_node(path)[0]


SearchField = graphene.Field(
    StorageUnion,
    path=graphene.NonNull(graphene.String),
    resolver=resolve_search,
)
__all__ = ["SearchField"]
