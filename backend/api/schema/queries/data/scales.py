"""scales schema"""
from graphene import relay, ObjectType

from backend.api.models import LinearScale, MultiLinearScale
from backend.utils.schema import ApiObjectType, AuthenticatedDjangoConnectionField


class LinearScaleNode(ApiObjectType):
    """LinearScale schema"""

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = LinearScale
        fields = "__all__"
        filter_fields = "__all__"
        interfaces = (relay.Node,)


class MultiLinearScaleNode(ApiObjectType):
    """MultiLinearScale schema"""

    inner_scales = AuthenticatedDjangoConnectionField(LinearScaleNode)

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = MultiLinearScale
        fields = "__all__"
        filter_fields = "__all__"
        interfaces = (relay.Node,)


class ScalesQuery(ObjectType):  # pylint: disable=too-few-public-methods
    """Scales queries"""

    all_linear_scales = AuthenticatedDjangoConnectionField(LinearScaleNode)
    all_multi_linear_scales = AuthenticatedDjangoConnectionField(MultiLinearScaleNode)
