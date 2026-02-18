from typing import Optional

import graphene
from django.conf import settings
from django_extension.schema.permissions import GraphQLResolve, GraphQLPermissions

from backend.storage.schema.resolver import get_resolver
from backend.storage.schema.union import StorageUnion

__all__ = ["BrowseField"]


@GraphQLResolve(permission=GraphQLPermissions.STAFF_OR_SUPERUSER)
def resolve_browse(root, _, path: Optional[str] = None):
    """Get all datasets for import"""
    resolver = get_resolver(settings.DATASET_EXPORT_PATH, path)
    return resolver.browse()


BrowseField = graphene.Field(
    graphene.List(
        StorageUnion,
    ),
    path=graphene.String(),
    resolver=resolve_browse,
)
