"""API data spectrogram administration"""
from django.contrib import admin
from django_extension.admin import get_many_to_many

from backend.api.models import Spectrogram


@admin.register(Spectrogram)
class SpectrogramAdmin(admin.ModelAdmin):
    """Spectrogram administration"""

    list_display = [
        "filename",
        "analysis",
        "start",
        "end",
    ]
    search_fields = [
        "analysis__name",
        "analysis__dataset__name",
    ]

    @admin.display(description="Analysis")
    def analysis(self, obj: Spectrogram):
        """Display analysis"""
        return get_many_to_many(obj, "analysis")
