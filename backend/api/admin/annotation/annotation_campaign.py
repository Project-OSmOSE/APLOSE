"""API annotation annotation campaign administration"""
from django.contrib import admin
from django.utils.safestring import SafeString
from django_extension.admin import ExtendedModelAdmin

from backend.api.admin.common.__abstract_archivable import (
    admin_unarchive,
)
from backend.api.models import AnnotationCampaign
from ...models.annotation.annotation_campaign import (
    AnnotationCampaignAnalysis,
    AnnotationCampaignLabel,
)


class AnnotationCampaignAnalysisRelationInline(admin.TabularInline):
    """AnnotationCampaign entry with analysis related fields"""

    model = AnnotationCampaignAnalysis


class AnnotationCampaignLabelRelationInline(admin.TabularInline):
    """AnnotationCampaign entry with label related fields"""

    model = AnnotationCampaignLabel


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
        "get_labels",
        "allow_point_annotation",
        "owner",
        "show_spectrogram_analysis",
        "dataset",
        "confidence_set",
        "image_tuning",
        "colormap_tuning",
        "allow_digital_zoom",
    )
    inlines = (
        AnnotationCampaignAnalysisRelationInline,
        AnnotationCampaignLabelRelationInline,
    )

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

    @admin.display(description="Labels")
    def get_labels(self, obj: AnnotationCampaign):
        """show_labels"""
        return self.list_queryset(
            obj.annotationcampaignlabel_set.all(),
            to_str=lambda x: f"{str(x)} [AF]" if x.enable_acoustic_features else str(x),
        )

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
