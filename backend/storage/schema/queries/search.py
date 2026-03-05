import graphene
from django_extension.schema.permissions import GraphQLResolve, GraphQLPermissions

from backend.storage.model_resolvers import Resolver
from ..union import StorageUnion


@GraphQLResolve(permission=GraphQLPermissions.STAFF_OR_SUPERUSER)
def resolve_search(root, info, path: str):
    """Get all datasets for import"""
    return Resolver(path).get_item()


SearchField = graphene.Field(
    StorageUnion,
    path=graphene.NonNull(graphene.String),
    resolver=resolve_search,
)
__all__ = ["SearchField"]
