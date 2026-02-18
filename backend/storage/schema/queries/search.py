from pathlib import PureWindowsPath

import graphene
from django.conf import settings
from django_extension.schema.permissions import GraphQLResolve, GraphQLPermissions

from backend.storage.schema.resolver import get_resolver
from backend.storage.schema.union import StorageUnion

__all__ = ["SearchField"]


@GraphQLResolve(permission=GraphQLPermissions.STAFF_OR_SUPERUSER)
def resolve_search(root, _, path: str):
    """Get all datasets for import"""
    # pylint: disable=broad-except
    path = PureWindowsPath(path)
    path_str = PureWindowsPath(path).as_posix()
    root: str = PureWindowsPath(settings.DATASET_EXPORT_PATH).as_posix()
    resolver = None
    if root in path_str:
        path_str = path_str.split(root).pop().strip("/")
    elif path.anchor:
        # If the path as an anchor (is root) but allowed root isn't recognize, we shouldn't resolve
        return None
    try:
        resolver = get_resolver(root, path_str)
    except Exception:
        pass

    return resolver


SearchField = graphene.Field(
    StorageUnion(),
    path=graphene.NonNull(graphene.String),
    resolver=resolve_search,
)
