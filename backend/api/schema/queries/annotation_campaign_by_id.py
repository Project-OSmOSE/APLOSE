import graphene

from backend.api.schema.nodes import AnnotationCampaignNode
from backend.utils.schema import GraphQLPermissions, GraphQLResolve


@GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
def resolve_campaign(self, info, id: int):  # pylint: disable=redefined-builtin
    return AnnotationCampaignNode.get_node(info, id)


AnnotationCampaignByIdField = graphene.Field(
    AnnotationCampaignNode,
    id=graphene.ID(required=True),
    resolver=resolve_campaign,
)
