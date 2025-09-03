"""LabelSet schema"""
from graphene import relay, ObjectType, Field, ID

from backend.api.models import LabelSet, AnnotationCampaign
from backend.utils.schema import (
    ApiObjectType,
    AuthenticatedDjangoConnectionField,
    GraphQLResolve,
    GraphQLPermissions,
)
from .label import AnnotationLabelNode


class LabelSetNode(ApiObjectType):
    """LabelSet schema"""

    labels = AuthenticatedDjangoConnectionField(AnnotationLabelNode)

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = LabelSet
        fields = "__all__"
        filter_fields = "__all__"
        interfaces = (relay.Node,)


class LabelSetQuery(ObjectType):  # pylint: disable=too-few-public-methods
    """LabelSet queries"""

    all_label_sets = AuthenticatedDjangoConnectionField(LabelSetNode)

    annotation_campaign_label_set = Field(LabelSetNode, annotation_campaign_id=ID(required=True))

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    def resolve_annotation_campaign_label_set(self, info, annotation_campaign_id: int):
        """Get label set of the designated campaign"""
        return AnnotationCampaign.objects.get(id=annotation_campaign_id).label_set
