"""API data spectrogram administration"""
from django.contrib import admin
from django_extension.admin import ExtendedModelAdmin

from backend.api.models import Spectrogram


@admin.register(Spectrogram)
class SpectrogramAdmin(ExtendedModelAdmin):
    """Spectrogram administration"""

    list_display = [
        "filename",
        "display_analysis",
        "start",
        "end",
    ]
    search_fields = [
        "analysis__name",
        "analysis__dataset__name",
    ]

    @admin.display(description="Analysis")
    def display_analysis(self, obj: Spectrogram):
        """Display analysis"""
        return self.list_queryset(obj.analysis.all())
