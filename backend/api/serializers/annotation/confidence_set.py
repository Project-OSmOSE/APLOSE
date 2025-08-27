"""ConfidenceSet DRF serializers file"""

# Serializers have too many false-positives on the following warnings:
# pylint: disable=missing-function-docstring, abstract-method

from rest_framework import serializers

from backend.api.models import (
    ConfidenceIndicatorSetIndicator,
    ConfidenceSet,
)


class ConfidenceIndicatorRelationSerializer(serializers.ModelSerializer):
    """Serializer meant to output basic ConfidenceIndicator relation data"""

    is_default = serializers.BooleanField(default=False)
    id = serializers.PrimaryKeyRelatedField(source="confidence.id", read_only=True)
    label = serializers.CharField(source="confidence.label", read_only=True)
    level = serializers.IntegerField(source="confidence.level", read_only=True)

    class Meta:
        model = ConfidenceIndicatorSetIndicator
        exclude = ["confidence", "confidence_set"]


class ConfidenceSetSerializer(serializers.ModelSerializer):
    """Serializer meant to output basic ConfidenceIndicatorSet data"""

    confidence_indicators = ConfidenceIndicatorRelationSerializer(
        source="indicator_relations", many=True
    )

    class Meta:
        model = ConfidenceSet
        fields = "__all__"
