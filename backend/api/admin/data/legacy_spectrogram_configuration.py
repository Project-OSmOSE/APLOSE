"""API data LegacySpectrogramConfiguration administration"""
from django.contrib import admin
from django_extension.admin import ExtendedModelAdmin

from backend.api.models import LegacySpectrogramConfiguration


@admin.register(LegacySpectrogramConfiguration)
class LegacySpectrogramConfigurationAdmin(ExtendedModelAdmin):
    """LegacySpectrogramConfiguration presentation in DjangoAdmin"""

    list_display = (
        "id",
        "spectrogram_analysis",
        "folder",
        "zoom_level",
        "spectrogram_normalization",
        "data_normalization",
        "zscore_duration",
        "hp_filter_min_frequency",
        "window_type",
        "frequency_resolution",
        "temporal_resolution",
        "sensitivity_dB",
        "peak_voltage",
    )
    search_fields = [
        "spectrogram_analysis__dataset__name",
    ]
