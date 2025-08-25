"""API Common archive serializer"""
from rest_framework import serializers

from backend.api.models import Archive
from backend.aplose.serializers import UserSerializer


class ArchiveSerializer(serializers.ModelSerializer):
    """Serializer for archive"""

    by_user = UserSerializer(read_only=True)

    class Meta:
        model = Archive
        fields = "__all__"
