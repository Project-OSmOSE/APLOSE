import graphene

from backend.api.models import MultiLinearScale
from backend.utils.schema.types import BaseObjectType, BaseNode
from .linear_scale_node import LinearScaleNode


class MultiLinearScaleNode(BaseObjectType):
    """MultiLinearScale schema"""

    inner_scales = graphene.List(LinearScaleNode())

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = MultiLinearScale
        fields = "__all__"
        filter_fields = ()
        interfaces = (BaseNode,)
