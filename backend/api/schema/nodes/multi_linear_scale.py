import graphene
import graphene_django_optimizer
from django_extension.schema.types import ExtendedNode

from backend.api.models import MultiLinearScale
from .linear_scale import LinearScaleNode


class MultiLinearScaleNode(ExtendedNode):
    """MultiLinearScale schema"""

    class Meta:
        model = MultiLinearScale
        fields = "__all__"
        filter_fields = ()

    inner_scales = graphene.List(LinearScaleNode())

    @graphene_django_optimizer.resolver_hints()
    def resolve_inner_scales(self: MultiLinearScale, info):
        return self.inner_scales.all()
