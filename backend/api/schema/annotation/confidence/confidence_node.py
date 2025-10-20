import graphene

from backend.api.models import Confidence
from backend.utils.schema.types import BaseObjectType, BaseNode


class ConfidenceNode(BaseObjectType):
    """Confidence schema"""

    is_default = graphene.Boolean()

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = Confidence
        fields = "__all__"
        filter_fields = "__all__"
        interfaces = (BaseNode,)
