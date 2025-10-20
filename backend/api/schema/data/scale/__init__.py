import graphene

from backend.utils.schema import AuthenticatedDjangoConnectionField
from .linear_scale_node import LinearScaleNode
from .multi_scale_node import MultiLinearScaleNode


class ScalesQuery(graphene.ObjectType):  # pylint: disable=too-few-public-methods
    """Scales queries"""

    all_linear_scales = AuthenticatedDjangoConnectionField(LinearScaleNode)
    all_multi_linear_scales = AuthenticatedDjangoConnectionField(MultiLinearScaleNode)
