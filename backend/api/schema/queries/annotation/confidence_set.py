"""ConfidenceSet schema"""
from django.db.models import F
from graphene import relay, ObjectType, Field

from backend.api.models import ConfidenceSet, AnnotationCampaign
from backend.utils.schema import (
    ApiObjectType,
    AuthenticatedDjangoConnectionField,
    GraphQLPermissions,
    GraphQLResolve,
    PK,
)
from .confidence import ConfidenceNode


class ConfidenceSetNode(ApiObjectType):
    """ConfidenceSet schema"""

    confidence_indicators = AuthenticatedDjangoConnectionField(ConfidenceNode)

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = ConfidenceSet
        fields = "__all__"
        filter_fields = "__all__"
        interfaces = (relay.Node,)

    def resolve_confidence_indicators(self, info):
        """Resolve confidence indicators with default"""
        # d: ConfidenceSet
        # d.confidence_indicators.annotate(is_default=F("set_relations__is_default"))

        return self.confidence_indicators.annotate(
            is_default=F("set_relations__is_default")
        )


class ConfidenceSetQuery(ObjectType):  # pylint: disable=too-few-public-methods
    """ConfidenceSet queries"""

    annotation_campaign_confidence_set = Field(
        ConfidenceSetNode, annotation_campaign_id=PK(required=True)
    )

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    def resolve_annotation_campaign_confidence_set(
        self, info, annotation_campaign_id: int
    ):
        """Get confidence set of the designated campaign"""
        return AnnotationCampaign.objects.get(id=annotation_campaign_id).confidence_set
