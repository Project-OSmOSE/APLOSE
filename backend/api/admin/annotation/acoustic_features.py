"""API annotation acoustic features administration"""
from django.contrib import admin
from django_extension.admin import ExtendedModelAdmin

from backend.api.models import AcousticFeatures


@admin.register(AcousticFeatures)
class AcousticFeaturesAdmin(ExtendedModelAdmin):
    """AcousticFeatures presentation in DjangoAdmin"""

    list_display = (
        "id",
        "is_intensity_too_low",
        "does_overlap_other_signals",
        # Frequency
        "start_frequency",
        "end_frequency",
        "relative_min_frequency_count",
        "relative_max_frequency_count",
        "inflexion_point_count",
        "steps_count",
        "has_harmonics",
        "trend",
        # Non-linear phenomena
        "has_sidebands",
        "has_subharmonics",
        "has_frequency_jumps",
        "frequency_jumps_count",
        "has_deterministic_chaos",
        "get_annotation",
    )

    search_fields = ("annotation__annotation_phase__annotation_campaign__name",)

    @admin.display(description="Annotation")
    def get_annotation(self, obj: AcousticFeatures):
        """Get annotation edit link"""
        return self.display_foreign_key(obj.annotation, allow_edit=True)
