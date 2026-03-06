from typing import Optional

import graphene
from django_extension.schema.permissions import GraphQLResolve, GraphQLPermissions

from backend.storage.resolvers import Resolver
from ..union import StorageUnion


@GraphQLResolve(permission=GraphQLPermissions.STAFF_OR_SUPERUSER)
def resolve_browse(root, info, path: Optional[str] = None):
    """Get all datasets for import"""
    return Resolver(path).get_children_items()


BrowseField = graphene.Field(
    graphene.List(
        StorageUnion,
    ),
    path=graphene.String(),
    resolver=resolve_browse,
)
__all__ = ["BrowseField"]
