"""API annotation confidence administration"""
from django.contrib import admin, messages
from django.db import IntegrityError, transaction
from django_extension.admin import ExtendedModelAdmin

from backend.api.models import Confidence


@admin.register(Confidence)
class ConfidenceAdmin(ExtendedModelAdmin):
    """Confidence presentation in DjangoAdmin"""

    list_display = (
        "id",
        "label",
        "level",
    )

    def save_model(self, request, obj, form, change):
        try:
            with transaction.atomic():
                super().save_model(request, obj, form, change)
        except IntegrityError as error:
            messages.set_level(request, messages.ERROR)
            messages.error(request, error)
