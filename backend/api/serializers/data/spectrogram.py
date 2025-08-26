"""Spectrogram serializers"""
from django.utils.http import urlquote
from rest_framework import serializers

from backend import settings
from backend.api.models import Spectrogram, SpectrogramAnalysis, Dataset


class SpectrogramSerializer(serializers.ModelSerializer):
    """Serializer meant to output basic Spectrogram data"""

    dataset_sr = serializers.FloatField(read_only=True)
    audio_url = serializers.SerializerMethodField(read_only=True)
    dataset_name = serializers.SlugRelatedField(
        slug_field="name", read_only=True, source="dataset"
    )

    class Meta:
        model = Spectrogram
        fields = "__all__"

    def get_audio_url(self, spectrogram: Spectrogram):
        """Get audio file URL"""
        analysis: SpectrogramAnalysis = spectrogram.analysis.first()
        dataset: Dataset = analysis.dataset
        if analysis.legacy:
            return urlquote(
                str(
                    settings.STATIC_URL
                    / settings.DATASET_EXPORT_PATH
                    / dataset.path
                    / settings.DATASET_FILES_FOLDER
                    / dataset.get_config_folder()
                    / f"{spectrogram.filename}.{spectrogram.format}"
                )
            )
        # TODO: for non legacy!!
        return "TODO"
