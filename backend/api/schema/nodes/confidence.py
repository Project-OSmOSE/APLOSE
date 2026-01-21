import graphene
from django_extension.schema.types import ExtendedNode

from backend.api.models import Confidence


class ConfidenceNode(ExtendedNode):
    """Confidence schema"""

    is_default = graphene.Boolean()

    class Meta:
        model = Confidence
        fields = "__all__"
        filter_fields = "__all__"
