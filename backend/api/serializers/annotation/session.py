"""Annotation session serializer"""
from rest_framework import serializers

from backend.api.models import (
    Session,
)


class SessionSerializer(serializers.ModelSerializer):
    """Session serializer"""

    class Meta:
        model = Session
        fields = "__all__"
