import graphene
from django.db.models import Q
from django.shortcuts import get_object_or_404

from backend.api.models import Spectrogram, AnnotationPhase, AnnotationFileRange
from backend.api.schema.enums import AnnotationPhaseType
from backend.api.serializers import AnnotationSerializer
from backend.utils.schema.mutations import ListSerializerMutation


class UpdateAnnotationsMutation(ListSerializerMutation):
    class Input:
        campaign_id = graphene.ID(required=True)
        phase_type = AnnotationPhaseType(required=True)
        spectrogram_id = graphene.ID(required=True)

    class Meta:
        serializer_class = AnnotationSerializer
        exclude_fields = (
            "type",
            "annotator_expertise_level",
            "spectrogram",
        )

    @classmethod
    def get_serializer_queryset(cls, root, info, **input):
        spectrogram: Spectrogram = get_object_or_404(
            Spectrogram.objects.all(), pk=input["spectrogram_id"]
        )
        if input.get("phase_type").value == AnnotationPhaseType.Annotation:
            return AnnotationFileRange.objects.filter_editable_by(
                user=info.context.user,
                annotation_phase__annotation_campaign_id=input["campaign_id"],
                annotation_phase__phase=AnnotationPhase.Type.ANNOTATION,
                from_datetime__lt=spectrogram.end,
                to_datetime__gt=spectrogram.start,
            )
        return AnnotationFileRange.objects.filter_viewable_by(
            user=info.context.user,
            annotation_phase__annotation_campaign_id=input["campaign_id"],
            from_datetime__lt=spectrogram.end,
            to_datetime__gt=spectrogram.start,
        ).filter(
            Q(
                annotation_phase__phase=AnnotationPhase.Type.VERIFICATION,
                annotator_id=info.context.user.id,
            )
            | (
                Q(annotation_phase__phase=AnnotationPhase.Type.ANNOTATION)
                & ~Q(annotator_id=info.context.user.id)
            )
        )

    @classmethod
    def get_serializer_context(cls, root, info, **input):
        phase = AnnotationPhase.objects.get_viewable_or_fail(
            info.context.user,
            annotation_campaign_id=input["campaign_id"],
            phase=input["phase_type"].value,
        )
        return {
            "user": info.context.user,
            "phase": phase,
            "spectrogram": Spectrogram.objects.get(pk=input["spectrogram_id"]),
        }
