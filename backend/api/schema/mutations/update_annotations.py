import graphene

from backend.api.models import Spectrogram
from backend.api.schema.context_filters import (
    AnnotationPhaseContextFilter,
)
from backend.api.schema.context_filters.annotation import AnnotationContextFilter
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
            "annotation_phase",
            "spectrogram",
        )

    @classmethod
    def get_serializer_queryset(cls, root, info, **input):
        return AnnotationContextFilter.get_edit_queryset(
            info.context,
            annotation_phase__annotation_campaign_id=input["campaign_id"],
            annotation_phase__phase=input["phase_type"].value,
            spectrogram_id=input["spectrogram_id"],
        )

    @classmethod
    def get_serializer_context(cls, root, info, **input):
        phase = AnnotationPhaseContextFilter.get_node_or_fail(
            info.context,
            annotation_campaign_id=input["campaign_id"],
            phase=input["phase_type"].value,
        )
        return {
            "user": info.context.user,
            "phase": phase,
            "spectrogram": Spectrogram.objects.get(pk=input["spectrogram_id"]),
        }
