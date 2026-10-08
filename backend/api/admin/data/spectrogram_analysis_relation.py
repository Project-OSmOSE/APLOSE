"""API data spectrogram analysis administration"""
from django.contrib import admin
from django.http import HttpRequest
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

    def has_add_permission(self, request: HttpRequest) -> bool:
        return False

    def has_change_permission(self, request: HttpRequest, obj: SpectrogramAnalysisRelation | None = None) -> bool:
        return False

