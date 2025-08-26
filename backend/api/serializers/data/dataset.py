"""API dataset serializer"""
from rest_framework import serializers

from backend.api.models import Dataset


class DatasetSerializer(serializers.ModelSerializer):
    """Serializer meant to output basic Dataset data"""

    # files_count = serializers.IntegerField()
    # related_channel_configuration = ChannelConfigurationSerializer(many=True)

    class Meta:
        model = Dataset
        fields = "__all__"
