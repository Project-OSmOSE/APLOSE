"""LabelSet schema"""
from graphene import relay

from backend.api.models import LabelSet
from backend.utils.schema import ApiObjectType, AuthenticatedDjangoConnectionField
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
