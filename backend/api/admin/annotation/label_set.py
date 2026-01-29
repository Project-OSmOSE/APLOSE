"""API annotation label set administration"""
from django.contrib import admin
from django_extension.admin import ExtendedModelAdmin

from backend.api.models import LabelSet


@admin.register(LabelSet)
class LabelSetAdmin(ExtendedModelAdmin):
    """LabelSet presentation in DjangoAdmin"""

    list_display = (
        "name",
        "description",
        "show_labels",
    )

    @admin.display(description="Labels")
    def show_labels(self, obj):
        """show_labels"""
        return self.list_queryset(obj.labels.all())
