"""API annotation label administration"""
from django.contrib import admin
from django_extension.admin import ExtendedModelAdmin

from backend.api.models import Label


@admin.register(Label)
class LabelAdmin(ExtendedModelAdmin):
    """Label presentation in DjangoAdmin"""

    list_display = (
        "id",
        "name",
        "metadatax_label",
    )
    autocomplete_fields = [
        "metadatax_label",
    ]
