from django.contrib import admin

from backend.background_tasks.models import BackgroundTask


@admin.register(BackgroundTask)
class BackgroundTaskAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "type",
        "status",
        "additional_info",
        "completion_percentage",
        "created_at",
        "started_at",
        "completed_at",
        "duration",
    ]
    list_filter = ["type", "status"]


__all__ = ["BackgroundTaskAdmin"]
