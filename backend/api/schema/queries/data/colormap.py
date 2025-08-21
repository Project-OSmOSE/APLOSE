"""Colormap model"""
from graphene import relay, ObjectType

from backend.api.models import Colormap
from backend.utils.schema import ApiObjectType, AuthenticatedDjangoConnectionField


class ColormapNode(ApiObjectType):
    """Colormap schema"""

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = Colormap
        fields = "__all__"
        filter_fields = "__all__"
        interfaces = (relay.Node,)


class ColormapQuery(ObjectType):  # pylint: disable=too-few-public-methods
    """Colormap queries"""

    all_colormaps = AuthenticatedDjangoConnectionField(ColormapNode)
