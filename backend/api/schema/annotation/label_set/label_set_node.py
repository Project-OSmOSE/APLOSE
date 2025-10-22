import graphene_django_optimizer
from graphene import List

from backend.api.models import LabelSet
from backend.utils.schema.types import BaseObjectType, BaseNode
from ..label.label_node import AnnotationLabelNode


class LabelSetNode(BaseObjectType):
    """LabelSet schema"""

    labels = List(AnnotationLabelNode, required=True)

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = LabelSet
        fields = "__all__"
        filter_fields = "__all__"
        interfaces = (BaseNode,)

    @graphene_django_optimizer.resolver_hints()
    def resolve_labels(self: LabelSet, info):
        """Resolve featured labels"""
        return self.labels.all()
