import graphene
import graphene_django_optimizer
from django.db.models import F
from django_extension.schema.types import ExtendedNode

from backend.api.models import ConfidenceSet
from .confidence import ConfidenceNode


class ConfidenceSetNode(ExtendedNode):
    """ConfidenceSet schema"""

    class Meta:
        model = ConfidenceSet
        fields = "__all__"
        filter_fields = "__all__"

    confidence_indicators = graphene.List(ConfidenceNode)

    @graphene_django_optimizer.resolver_hints()
    def resolve_confidence_indicators(self: ConfidenceSet, info):
        """Resolve confidence indicators with default"""
        return self.confidence_indicators.annotate(
            is_default=F("set_relations__is_default")
        )
