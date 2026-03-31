from django.contrib import admin

from backend.background_tasks.models import ImportAnalysisBackgroundTask


@admin.register(ImportAnalysisBackgroundTask)
class ImportAnalysisBackgroundTaskAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "type",
        "status",
        "completion_percentage",
        "created_at",
        "started_at",
        "completed_at",
        "duration",
        "error",
        "error_trace",
        "analysis",
        "analysis_path",
        "dataset",
        "total_spectrograms",
        "completed_spectrograms",
        "chunk_size",
        "requested_by",
    ]
    list_filter = [
        "status",
    ]
    search_fields = [
        "analysis_path",
        "dataset__name",
        "analysis__name",
    ]


__all__ = ["ImportAnalysisBackgroundTaskAdmin"]
