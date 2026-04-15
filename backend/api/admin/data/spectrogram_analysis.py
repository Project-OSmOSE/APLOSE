"""API data spectrogram analysis administration"""

from django.contrib import admin
from django.db.models import QuerySet
from django_extension.admin import ExtendedModelAdmin

from backend.api.models import SpectrogramAnalysis
from backend.storage.resolvers._osekit import OSEkitResolver


def store_paths(analysis: SpectrogramAnalysis):
    """Store spectrogram and audio paths in database"""
    # pylint: disable=broad-exception-raised
    # Only process one analysis

    if analysis.legacy:
        for relation in analysis.spectrogram_relations.all():
            paths = relation.get_legacy_paths()
            relation.audio_path = paths["audio"]
            relation.spectrogram_path = paths["spectrogram"]
            relation.save()
        return

    # pylint: disable=protected-access
    spectro_dataset = OSEkitResolver._get_spectro_dataset(analysis=analysis)
    if not spectro_dataset:
        raise Exception(f"Cannot found spectro_dataset for analysis: {analysis}")

    relations_to_fill = analysis.spectrogram_relations.filter(
        spectrogram_path__isnull=False,
    )
    for spectro_data in spectro_dataset.data:
        spectrogram_relation = relations_to_fill.filter(
            spectrogram__filename=spectro_data.name,
        ).first()
        if not spectrogram_relation:
            continue
        paths = spectrogram_relation.get_paths(
            spectro_data=spectro_data, spectro_dataset=spectro_dataset
        )
        spectrogram_relation.audio_path = paths["audio"]
        spectrogram_relation.spectrogram_path = paths["spectrogram"]
        spectrogram_relation.save()


@admin.register(SpectrogramAnalysis)
class SpectrogramAnalysisAdmin(ExtendedModelAdmin):
    """SpectrogramAnalysis presentation in DjangoAdmin"""

    list_display = (
        "id",
        "name",
        "created_at",
        "description",
        "owner",
        "path",
        "dataset",
        "data_duration",
        "fft",
        "colormap",
        "dynamic",
        "start",
        "end",
        "legacy",
    )
    search_fields = ["id", "name", "dataset__name"]

    def dynamic(self, obj: SpectrogramAnalysis) -> str:
        """Get dynamic min and max in one field"""
        return f"{obj.dynamic_min} - {obj.dynamic_max}"

    actions = [
        "store_paths",
    ]

    @admin.action(description="Store paths")
    def store_paths(self, request, queryset: QuerySet[SpectrogramAnalysis]):
        """Store spectrogram and audio paths in database"""
        # Only process one analysis
        analysis = queryset.first()
        store_paths(analysis=analysis)
