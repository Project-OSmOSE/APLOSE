"""API annotation annotation comment administration"""
from django.contrib import admin
from django_extension.admin import ExtendedModelAdmin

from backend.api.models import AnnotationComment


@admin.register(AnnotationComment)
class AnnotationCommentAdmin(ExtendedModelAdmin):
    """AnnotationComment presentation in DjangoAdmin"""

    list_display = (
        "id",
        "comment",
        "annotation",
        "annotation_phase",
        "spectrogram",
        "author",
    )
    search_fields = (
        "comment",
        "annotator__username",
        "annotator__first_name",
        "annotator__last_name",
        "annotation_phase__annotation_campaign__name",
    )
