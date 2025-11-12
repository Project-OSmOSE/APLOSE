import graphene

from backend.api.schema.nodes import DatasetNode
from backend.utils.schema import GraphQLPermissions, GraphQLResolve


@GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
def resolve_dataset(self, info, id: int):
    """Get dataset by id"""
    return DatasetNode.get_node(info, id)


DatasetByIdField = graphene.Field(
    DatasetNode, id=graphene.ID(required=True), resolver=resolve_dataset
)
