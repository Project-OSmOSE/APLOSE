"""AcousticFeatures schema"""
from graphene import relay, Enum

from backend.api.models import AcousticFeatures
from backend.utils.schema import ApiObjectType


class SignalTrendType(Enum):
    """From AcousticFeatures.SignalTrend"""

    Flat = "FLAT"
    Ascending = "ASC"
    Descending = "DESC"
    Modulated = "MOD"


class AcousticFeaturesNode(ApiObjectType):
    """AcousticFeatures schema"""

    trend = SignalTrendType()

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AcousticFeatures
        fields = "__all__"
        filter_fields = "__all__"
        interfaces = (relay.Node,)
