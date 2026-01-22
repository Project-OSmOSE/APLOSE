"""API annotation Detector administration"""
from django.contrib import admin
from django_extension.admin import ExtendedModelAdmin

from backend.api.models import Detector


@admin.register(Detector)
class DetectorAdmin(ExtendedModelAdmin):
    """Detector presentation in DjangoAdmin"""

    list_display = ("id", "name", "specification")

    search_fields = ("name", "configurations__configuration")
