"""API data dataset administration"""
from django.contrib import admin
from django_extension.admin import ExtendedModelAdmin

from backend.api.models import Dataset


@admin.register(Dataset)
class DatasetAdmin(ExtendedModelAdmin):
    """Dataset presentation in DjangoAdmin"""

    actions = [
        "export",
    ]

    list_display = (
        "name",
        "description",
        "created_at",
        "path",
        "legacy",
        "owner",
        "show_spectrogram_analysis",
        "show_channel_configuration",
    )

    search_fields = ["name", "related_channel_configurations__deployment__name"]

    filter_horizontal = [
        "related_channel_configurations",
    ]

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
