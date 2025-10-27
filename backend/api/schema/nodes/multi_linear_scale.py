import graphene
import graphene_django_optimizer

from backend.api.models import MultiLinearScale
from backend.utils.schema.types import BaseObjectType, BaseNode
from .linear_scale import LinearScaleNode


class MultiLinearScaleNode(BaseObjectType):
    """MultiLinearScale schema"""

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = MultiLinearScale
        fields = "__all__"
        filter_fields = ()
        interfaces = (BaseNode,)

    inner_scales = graphene.List(LinearScaleNode())

    @graphene_django_optimizer.resolver_hints()
    def resolve_inner_scales(self: MultiLinearScale, info):
        return self.inner_scales.all()
