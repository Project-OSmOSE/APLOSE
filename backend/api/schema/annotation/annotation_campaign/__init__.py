"""Annotation campaign schema"""
from graphene import ObjectType, Field, ID

from backend.utils.schema import (
    AuthenticatedDjangoConnectionField,
    GraphQLResolve,
    GraphQLPermissions,
)
from .archive_mutation import ArchiveAnnotationCampaignMutation
from .campaign_context_filter import AnnotationCampaignContextFilter
from .campaign_node import AnnotationCampaignNode
from .create_mutation import CreateAnnotationCampaignMutation
from .update_mutation import UpdateAnnotationCampaignMutation


class AnnotationCampaignQuery(ObjectType):  # pylint: disable=too-few-public-methods
    """AnnotationCampaign queries"""

    all_annotation_campaigns = AuthenticatedDjangoConnectionField(
        AnnotationCampaignNode
    )

    annotation_campaign_by_id = Field(AnnotationCampaignNode, id=ID(required=True))

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    def resolve_annotation_campaign_by_id(self, info, id: int):
        """Get AnnotationCampaign by id"""
        return AnnotationCampaignNode.get_node(info, id)


class AnnotationCampaignMutation(ObjectType):  # pylint: disable=too-few-public-methods
    """AnnotationCampaign mutations"""

    create_annotation_campaign = CreateAnnotationCampaignMutation.Field()
    update_annotation_campaign = UpdateAnnotationCampaignMutation.Field()
    archive_annotation_campaign = ArchiveAnnotationCampaignMutation.Field()
