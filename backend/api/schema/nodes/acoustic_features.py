from django_extension.schema.types import ExtendedNode

from backend.api.models import AcousticFeatures
from backend.api.schema.enums import SignalTrendType


class AcousticFeaturesNode(ExtendedNode):
    """Annotation schema"""

    trend = SignalTrendType()

    class Meta:
        model = AcousticFeatures
        fields = "__all__"
