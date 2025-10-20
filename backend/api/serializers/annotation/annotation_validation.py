"""Annotation comment serializer"""
from rest_framework import serializers

from backend.api.models import (
    AnnotationValidation,
)
from backend.utils.serializers import ListSerializer


class AnnotationValidationSerializer(serializers.ModelSerializer):
    """Annotation validation"""

    class Meta:
        model = AnnotationValidation
        fields = "__all__"
        list_serializer_class = ListSerializer
        extra_kwargs = {
            "id": {
                "required": False,
                "allow_null": True,
            },
        }
