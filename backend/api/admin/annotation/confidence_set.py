"""API annotation confidence set administration"""
from django.contrib import admin
from django_extension.admin import ExtendedModelAdmin

from backend.api.models import ConfidenceIndicatorSetIndicator, ConfidenceSet


class ConfidenceRelationInline(admin.TabularInline):
    """Confidence entry with relation related fields"""

    model = ConfidenceIndicatorSetIndicator


@admin.register(ConfidenceSet)
class ConfidenceSetAdmin(ExtendedModelAdmin):
    """ConfidenceSet presentation in DjangoAdmin"""

    list_display = (
        "id",
        "name",
        "desc",
        "get_indicators",
    )
    inlines = (ConfidenceRelationInline,)

    @admin.display(description="Indicators")
    def get_indicators(self, confidence_set: ConfidenceSet):
        """Get indicators"""
        return self.list_queryset(confidence_set.confidence_indicators.all())
