"""API annotation annotation campaign administration"""
from django.contrib import admin
from django.utils.safestring import SafeString
from django_extension.admin import ExtendedModelAdmin

from backend.api.admin.common.__abstract_archivable import (
    admin_unarchive,
)
from backend.api.models import AnnotationCampaign
from ...models.annotation.annotation_campaign import AnnotationCampaignAnalysis


class AnnotationCampaignAnalysisRelationInline(admin.TabularInline):
    """Confidence entry with relation related fields"""

    model = AnnotationCampaignAnalysis


@admin.register(AnnotationCampaign)
class AnnotationCampaignAdmin(ExtendedModelAdmin):
    """AnnotationCampaign presentation in DjangoAdmin"""

    readonly_fields = ("archived",)

    list_display = (
        "id",
        "name",
        "description",
        "created_at",
        "archived",
        "instructions_url",
        "deadline",
        "label_set",
        "get_labels_with_acoustic_features",
        "allow_point_annotation",
        "owner",
        "show_spectrogram_analysis",
        "dataset",
        "confidence_set",
        "image_tuning",
        "colormap_tuning",
        "allow_digital_zoom",
    )
    inlines = (AnnotationCampaignAnalysisRelationInline,)

    filter_horizontal = ("labels_with_acoustic_features",)

    search_fields = (
        "name",
        "dataset__name",
    )

    list_filter = (
        "phases__phase",
        "archived",
        "allow_point_annotation",
    )

    actions = [
        admin_unarchive,
    ]

    @admin.display(description="Labels for acoustic features")
    def get_labels_with_acoustic_features(self, obj: AnnotationCampaign):
        """show_labels_with_acoustic_features"""
        return self.list_queryset(obj.labels_with_acoustic_features.all())

    @admin.display(description="Spectrogram analysis")
    def show_spectrogram_analysis(self, obj: AnnotationCampaign):
        """show_spectro_configs"""
        return self.list_queryset(
            obj.analysis.all(),
            to_str=lambda analysis: str(analysis.name),
        )

    @admin.display(description="Image tuning")
    def image_tuning(self, obj: AnnotationCampaign):
        """image_tuning information"""
        return obj.allow_image_tuning

    @admin.display(description="Colormap tuning")
    def colormap_tuning(self, obj: AnnotationCampaign):
        """colormap_tuning information"""
        if obj.allow_colormap_tuning:
            inverted = "(inverted)" if obj.colormap_inverted_default else ""
            return SafeString(
                f"""{obj.allow_colormap_tuning}<br/>{obj.colormap_default} {inverted}"""
            )
        return obj.allow_colormap_tuning
