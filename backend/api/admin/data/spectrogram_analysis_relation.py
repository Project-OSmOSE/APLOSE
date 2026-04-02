"""API data spectrogram analysis administration"""
from django.contrib import admin
from django_extension.admin import ExtendedModelAdmin

from backend.api.models import SpectrogramAnalysisRelation


@admin.register(SpectrogramAnalysisRelation)
class SpectrogramAnalysisRelationAdmin(ExtendedModelAdmin):
    """SpectrogramAnalysisRelation presentation in DjangoAdmin"""

    list_display = (
        "id",
        "analysis",
        "analysis_id",
        "spectrogram",
        "audio_path",
        "spectrogram_path",
    )
