from typing import Optional

import graphene
from django_extension.schema.permissions import GraphQLResolve, GraphQLPermissions

from backend.storage.resolvers import GraphQLResolver
from backend.storage.schema.union import StorageUnion

__all__ = ["BrowseField"]


@GraphQLResolve(permission=GraphQLPermissions.STAFF_OR_SUPERUSER)
def resolve_browse(root, _, path: Optional[str] = None):
    """Get all datasets for import"""
    return GraphQLResolver.get(path or "").list_inner_nodes()


BrowseField = graphene.Field(
    graphene.List(
        StorageUnion,
    ),
    path=graphene.String(),
    resolver=resolve_browse,
)
