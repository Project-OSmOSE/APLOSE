"""API data dataset administration"""
from django.contrib import admin
from django.core.handlers.wsgi import WSGIRequest
from django.db.models import QuerySet
from django_extension.admin import ExtendedModelAdmin

from backend.api.models import Dataset


@admin.register(Dataset)
class DatasetAdmin(ExtendedModelAdmin):
    """Dataset presentation in DjangoAdmin"""

    actions = [
        "export",
        "archive",
    ]

    list_display = (
        "name",
        "description",
        "created_at",
        "path",
        "legacy",
        "archived",
        "owner",
        "show_spectrogram_analysis",
        "show_channel_configuration",
    )

    search_fields = ["name", "related_channel_configurations__deployment__name"]
    list_filter = [
        'archived',
    ]

    filter_horizontal = [
        "related_channel_configurations",
    ]

    @admin.action(description="Archive")
    def archive(self, request: WSGIRequest, queryset: QuerySet[Dataset]):
        """Archive dataset"""
        for dataset in queryset:
            dataset.archive(user=request.user)

    @admin.display(description="Metadatax channel configurations")
    def show_channel_configuration(self, dataset: Dataset) -> str:
        """show_channel_configuration"""
        return self.list_queryset(
            dataset.related_channel_configurations.all(),
            allow_edit=True,
        )

    @admin.display(description="Spectrogram analysis")
    def show_spectrogram_analysis(self, dataset: Dataset) -> str:
        """show_channel_configuration"""
        return self.list_queryset(
            dataset.spectrogram_analysis.all(),
            allow_edit=True,
        )
