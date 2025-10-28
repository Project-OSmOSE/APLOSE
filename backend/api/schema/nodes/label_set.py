import graphene
import graphene_django_optimizer

from backend.api.models import LabelSet
from backend.utils.schema.types import BaseObjectType, BaseNode
from .label import AnnotationLabelNode


class LabelSetNode(BaseObjectType):
    """LabelSet schema"""

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = LabelSet
        fields = "__all__"
        filter_fields = "__all__"
        interfaces = (BaseNode,)

    labels = graphene.List(AnnotationLabelNode, required=True)

    @graphene_django_optimizer.resolver_hints()
    def resolve_labels(self: LabelSet, info):
        """Resolve featured labels"""
        return self.labels.all()
