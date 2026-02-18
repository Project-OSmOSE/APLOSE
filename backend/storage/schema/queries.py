from typing import Optional

import graphene
from django.conf import settings
from django_extension.schema.permissions import GraphQLResolve, GraphQLPermissions

from .resolver import get_resolver
from .union import StorageUnion

__all__ = ["BrowseField"]


@GraphQLResolve(permission=GraphQLPermissions.STAFF_OR_SUPERUSER)
def resolver_folder(root, _, path: Optional[str] = None):
    """Get all datasets for import"""
    resolver = get_resolver(settings.DATASET_EXPORT_PATH, path)
    return resolver.browse()


BrowseField = graphene.Field(
    graphene.List(
        StorageUnion,
    ),
    path=graphene.String(),
    resolver=resolver_folder,
)
