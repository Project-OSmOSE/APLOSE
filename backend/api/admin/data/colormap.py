"""API data colormap administration"""
from django.contrib import admin
from django_extension.admin import ExtendedModelAdmin

from backend.api.models import Colormap


@admin.register(Colormap)
class ColormapAdmin(ExtendedModelAdmin):
    """Colormap presentation in DjangoAdmin"""

    list_display = (
        "id",
        "name",
    )
