"""API data fft administration"""
from django.contrib import admin
from django_extension.admin import ExtendedModelAdmin

from backend.api.models import FFT


@admin.register(FFT)
class FFTAdmin(ExtendedModelAdmin):
    """FFT presentation in DjangoAdmin"""

    # pylint: disable=duplicate-code
    list_display = (
        "id",
        "nfft",
        "window_size",
        "overlap",
        "sampling_frequency",
        "scaling",
        "legacy",
    )
