from django.db.models import F
from graphene import List

from backend.api.models import ConfidenceSet
from backend.utils.schema.types import BaseObjectType, BaseNode
from ..confidence.confidence_node import ConfidenceNode


class ConfidenceSetNode(BaseObjectType):
    """ConfidenceSet schema"""

    confidence_indicators = List(ConfidenceNode)

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = ConfidenceSet
        fields = "__all__"
        filter_fields = "__all__"
        interfaces = (BaseNode,)

    def resolve_confidence_indicators(self: ConfidenceSet, info):
        """Resolve confidence indicators with default"""
        return self.confidence_indicators.annotate(
            is_default=F("set_relations__is_default")
        )
