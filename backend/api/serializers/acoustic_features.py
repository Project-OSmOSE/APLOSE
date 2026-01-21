from django_extension.serializers import EnumField
from rest_framework import serializers

from backend.api.models import AcousticFeatures


class AnnotationAcousticFeaturesSerializer(serializers.ModelSerializer):
    """AcousticFeatures serializer"""

    trend = EnumField(
        enum=AcousticFeatures.SignalTrend,
        allow_null=True,
        allow_blank=True,
        required=False,
    )

    class Meta:
        model = AcousticFeatures
        fields = "__all__"
