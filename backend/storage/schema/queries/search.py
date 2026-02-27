import graphene
from django_extension.schema.permissions import GraphQLResolve, GraphQLPermissions

from backend.storage.resolvers import GraphQLResolver
from backend.storage.schema.union import StorageUnion

__all__ = ["SearchField"]


@GraphQLResolve(permission=GraphQLPermissions.STAFF_OR_SUPERUSER)
def resolve_search(root, _, path: str):
    """Get all datasets for import"""
    return GraphQLResolver.get(path).get_node()


SearchField = graphene.Field(
    StorageUnion(),
    path=graphene.NonNull(graphene.String),
    resolver=resolve_search,
)
