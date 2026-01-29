import graphene
import graphene_django_optimizer
from django_extension.schema.types import ExtendedNode

from backend.api.models import LabelSet
from .label import AnnotationLabelNode


class LabelSetNode(ExtendedNode):
    """LabelSet schema"""

    class Meta:
        model = LabelSet
        fields = "__all__"
        filter_fields = "__all__"

    labels = graphene.List(AnnotationLabelNode, required=True)

    @graphene_django_optimizer.resolver_hints()
    def resolve_labels(self: LabelSet, info):
        """Resolve featured labels"""
        return self.labels.all()
