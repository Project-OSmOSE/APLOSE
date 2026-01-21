"""API data scales administration"""
from django.contrib import admin
from django_extension.admin import get_edit_links_for_queryset

from backend.api.models import LinearScale, MultiLinearScale


@admin.register(LinearScale)
class LinearScaleAdmin(admin.ModelAdmin):
    """LinearScale presentation in DjangoAdmin"""

    list_display = (
        "name",
        "ratio",
        "min_value",
        "max_value",
    )


@admin.register(MultiLinearScale)
class MultiLinearScaleAdmin(admin.ModelAdmin):
    """MultiLinearScale presentation in DjangoAdmin"""

    list_display = (
        "name",
        "inner_scales_links",
    )

    @admin.display(description="Inner scales")
    def inner_scales_links(self, obj: MultiLinearScale) -> str:
        """Get direct link to inner scales"""
        return get_edit_links_for_queryset(
            obj.inner_scales.all(),
            "admin:api_linearscale_change",
        )
