"""API data LegacySpectrogramConfiguration administration"""
from django.contrib import admin

from backend.api.models import LegacySpectrogramConfiguration


@admin.register(LegacySpectrogramConfiguration)
class LegacySpectrogramConfigurationAdmin(admin.ModelAdmin):
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
        "linear_frequency_scale",
        "multi_linear_frequency_scale",
    )
    search_fields = [
        "spectrogram_analysis__dataset__name",
    ]
