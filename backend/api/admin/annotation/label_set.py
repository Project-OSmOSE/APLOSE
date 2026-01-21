"""API annotation label set administration"""
from django.contrib import admin
from django_extension.admin import get_many_to_many

from backend.api.models import LabelSet


@admin.register(LabelSet)
class LabelSetAdmin(admin.ModelAdmin):
    """LabelSet presentation in DjangoAdmin"""

    list_display = (
        "name",
        "description",
        "show_labels",
    )

    @admin.display(description="Labels")
    def show_labels(self, obj):
        """show_labels"""
        return get_many_to_many(obj, "labels", "name")
