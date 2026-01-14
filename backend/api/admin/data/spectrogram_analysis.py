"""API data spectrogram analysis administration"""
from django.contrib import admin

from backend.api.models import SpectrogramAnalysis


@admin.register(SpectrogramAnalysis)
class SpectrogramAnalysisAdmin(admin.ModelAdmin):
    """SpectrogramAnalysis presentation in DjangoAdmin"""

    list_display = (
        "id",
        "name",
        "created_at",
        "description",
        "owner",
        "path",
        "dataset",
        "data_duration",
        "fft",
        "colormap",
        "dynamic",
        "start",
        "end",
        "legacy",
    )
    search_fields = ["name", "dataset__name"]

    def dynamic(self, obj: SpectrogramAnalysis) -> str:
        """Get dynamic min and max in one field"""
        return f"{obj.dynamic_min} - {obj.dynamic_max}"
