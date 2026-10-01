from django.contrib import admin
from django.core.handlers.wsgi import WSGIRequest
from django.db.models import QuerySet

from backend.api.models.common.__abstract_archivable import AbstractArchivable


@admin.action(description="Archive")
def admin_archive(
    model_admin, request: WSGIRequest, queryset: QuerySet[AbstractArchivable]
):
    """Archive items"""
    for item in queryset:
        item.archive(user=request.user)


@admin.action(description="Unarchive")
def admin_unarchive(
    model_admin, request: WSGIRequest, queryset: QuerySet[AbstractArchivable]
):
    """Archive items"""
    for item in queryset:
        item.unarchive(user=request.user)
