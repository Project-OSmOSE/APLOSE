import graphene
import graphene_django_optimizer
from django.db.models import Exists, OuterRef

from backend.api.models import (
    AnnotationCampaign,
    AnnotationFileRange,
    Spectrogram,
    Detector,
)
from backend.api.schema.context_filters import AnnotationCampaignContextFilter
from backend.api.schema.filter_sets import AnnotationCampaignFilterSet
from backend.aplose.models import User
from backend.aplose.schema import UserNode
from backend.utils.schema.types import BaseObjectType, BaseNode
from .spectrogram import SpectrogramNode
from .annotation_phase import AnnotationPhaseNode
from .archive import ArchiveNode
from .detector import DetectorNode
from .label import AnnotationLabelNode
from ..connections import SpectrogramConnection


class AnnotationCampaignNode(BaseObjectType):
    """AnnotationCampaign schema"""

    archive = ArchiveNode()

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AnnotationCampaign
        fields = "__all__"
        filterset_class = AnnotationCampaignFilterSet
        context_filter = AnnotationCampaignContextFilter
        interfaces = (BaseNode,)

    phases = graphene.List(AnnotationPhaseNode)

    @graphene_django_optimizer.resolver_hints()
    def resolve_phases(self: AnnotationCampaign, info):
        return self.phases.all()

    detectors = graphene.List(DetectorNode)

    @graphene_django_optimizer.resolver_hints()
    def resolve_detectors(self: AnnotationCampaign, info):
        return Detector.objects.filter(
            configurations__annotations__annotation_phase__in=self.phases.all()
        )

    annotators = graphene.List(UserNode)

    @graphene_django_optimizer.resolver_hints()
    def resolve_annotators(self: AnnotationCampaign, info):
        return User.objects.filter(
            Exists(
                AnnotationFileRange.objects.filter(
                    annotation_phase__annotation_campaign_id=self.id,
                    annotator_id=OuterRef("id"),
                )
            )
        )

    spectrograms = SpectrogramConnection(SpectrogramNode)

    @graphene_django_optimizer.resolver_hints()
    def resolve_spectrograms(self: AnnotationCampaign, info):
        return Spectrogram.objects.filter(
            analysis__annotation_campaigns__id=self.id
        ).distinct()

    labels_with_acoustic_features = graphene.List(AnnotationLabelNode)

    @graphene_django_optimizer.resolver_hints()
    def resolve_labels_with_acoustic_features(self: AnnotationCampaign, info):
        """Resolve featured labels"""
        return self.labels_with_acoustic_features.all()

    is_archived = graphene.Field(graphene.Boolean, required=True)

    @graphene_django_optimizer.resolver_hints()
    def resolve_is_archived(self: AnnotationCampaign, info):
        return self.archive is not None

    can_manage = graphene.Field(graphene.Boolean, required=True, default_value=False)

    @graphene_django_optimizer.resolver_hints()
    def resolve_can_manage(self: AnnotationCampaign, info):
        return self.archive is not None and (
            self.owner_id == info.context.user.id
            or info.context.user.is_staff
            or info.context.user.is_superuser
        )
