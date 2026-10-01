"""API annotation - annotation phase administration"""
from django.contrib import admin
from django_extension.admin import ExtendedModelAdmin

from backend.api.admin.common.__abstract_archivable import admin_unarchive
from backend.api.models import AnnotationPhase


@admin.register(AnnotationPhase)
class AnnotationPhaseAdmin(ExtendedModelAdmin):
    """AnnotationPhase presentation in DjangoAdmin"""

    list_display = (
        "id",
        "annotation_campaign",
        "phase",
        "created_at",
        "created_by",
        "archived",
    )
    search_fields = ("annotation_campaign__name",)

    list_filter = ("archived",)

    actions = [
        admin_unarchive,
    ]
