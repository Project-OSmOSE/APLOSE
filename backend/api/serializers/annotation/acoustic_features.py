from rest_framework import serializers

from backend.api.models import AcousticFeatures
from backend.utils.serializers import EnumField


class AnnotationAcousticFeaturesSerializer(serializers.ModelSerializer):
    """AcousticFeatures serializer"""

    trend = EnumField(
        enum=AcousticFeatures.SignalTrend, allow_null=True, allow_blank=True
    )

    class Meta:
        model = AcousticFeatures
        fields = "__all__"
