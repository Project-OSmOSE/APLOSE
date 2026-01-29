"""API annotation - annotation phase administration"""
from django.contrib import admin
from django_extension.admin import ExtendedModelAdmin

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
        "ended_at",
        "ended_by",
    )
    search_fields = ("annotation_campaign__name",)
