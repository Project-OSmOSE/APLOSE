"""API annotation detector configuration administration"""
from django.contrib import admin
from django_extension.admin import ExtendedModelAdmin

from backend.api.models import DetectorConfiguration


@admin.register(DetectorConfiguration)
class DetectorConfigurationAdmin(ExtendedModelAdmin):
    """DetectorConfiguration presentation in DjangoAdmin"""

    list_display = (
        "id",
        "detector",
        "configuration",
    )

    search_fields = (
        "detector__name",
        "configuration",
    )
