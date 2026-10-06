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
        "get_usages",
    )

    def save_model(self, request, obj, form, change):
        try:
            with transaction.atomic():
                super().save_model(request, obj, form, change)
        except IntegrityError as error:
            messages.set_level(request, messages.ERROR)
            messages.error(request, error)

    @admin.display(description="Usages")
    def get_usages(self, confidence: Confidence):
        """Get indicators"""
        return self.list_queryset(
            confidence.confidence_indicator_sets.all(), allow_edit=True
        )
