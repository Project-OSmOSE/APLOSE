"""AnnotationTask schema"""
from django.db.models import Q
from django_filters import FilterSet
from graphene import ObjectType, Field, Enum, Int
from graphene_django.filter import TypedFilter

from backend.api.models import (
    AnnotationTask,
    Spectrogram,
    AnnotationPhase,
    AnnotationFileRange,
)
from backend.utils.schema import (
    GraphQLResolve,
    GraphQLPermissions,
    PKFilter,
    PK,
    PKMultipleChoiceFilter,
)
from .annotation_phase import AnnotationPhaseType


class AnnotationTaskStatus(Enum):
    """From AnnotationTask.Status"""

    Created = "C"
    Finished = "F"


class AnnotationTaskFilter(FilterSet):
    """Annotation filters"""

    annotator_id = PKFilter()
    spectrogram_id = PKFilter()
    spectrogram_id__in = PKMultipleChoiceFilter(field_name="spectrogram_id")
    annotation_campaign_id = PKFilter(
        field_name="annotation_phase__annotation_campaign"
    )
    phase_type = TypedFilter(
        input_type=AnnotationPhaseType,
        field_name="annotation_phase__phase",
        lookup_expr="exact",
        exclude=False,
    )

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AnnotationTask
        fields = {}


# class AnnotationTaskNode(ApiObjectType):
#     """AnnotationTask schema"""
#
#     status = AnnotationTaskStatus()
#
#     class Meta:
#         # pylint: disable=missing-class-docstring, too-few-public-methods
#         model = AnnotationTask
#         fields = "__all__"
#         filterset_class = AnnotationTaskFilter
#         interfaces = (relay.Node,)


class AnnotationTaskIndexesNode(ObjectType):

    current = Int()
    total = Int()


class AnnotationTaskQuery(ObjectType):  # pylint: disable=too-few-public-methods
    """AnnotationTask queries"""

    # all_annotation_tasks = AuthenticatedDjangoConnectionField(AnnotationTaskNode)
    #
    # annotation_task = Field(
    #     AnnotationTaskNode,
    #     spectrogram_id=PK(required=True),
    #     annotator_id=PK(required=True),
    #     annotation_campaign_id=PK(required=True),
    #     phase_type=AnnotationPhaseType(required=True),
    # )

    annotation_task_indexes = Field(
        AnnotationTaskIndexesNode,
        spectrogram_id=PK(required=True),
        annotator_id=PK(required=True),
        annotation_campaign_id=PK(required=True),
        phase_type=AnnotationPhaseType(required=True),
    )

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    def resolve_annotation_task(
        self,
        info,
        spectrogram_id: int,
        annotator_id: int,
        annotation_campaign_id: int,
        phase_type: AnnotationPhaseType,
    ):  # pylint: disable=redefined-builtin
        """Get AnnotationCampaign by id"""
        return AnnotationTask.objects.get(
            annotation_phase__annotation_campaign_id=annotation_campaign_id,
            annotation_phase__phase=phase_type.value,
            annotator_id=annotator_id,
            spectrogram_id=spectrogram_id,
        )

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    def resolve_annotation_task_indexes(
        self,
        info,
        spectrogram_id: int,
        annotator_id: int,
        annotation_campaign_id: int,
        phase_type: AnnotationPhaseType,
    ):  # pylint: disable=redefined-builtin
        """Get AnnotationCampaign by id"""
        phase: AnnotationPhase = AnnotationPhase(
            annotation_campaign_id=annotation_campaign_id, phase=phase_type.value
        )
        file_ranges = AnnotationFileRange.objects.filter(
            annotation_phase_id=phase.id,
            annotator_id=annotator_id,
        )
        current_file: Spectrogram = Spectrogram.objects.get(id=spectrogram_id)
        min_datetime = min(file_ranges.values_list("from_datetime", flat=True))
        max_datetime = max(file_ranges.values_list("to_datetime", flat=True))
        all_files = Spectrogram.objects.filter(
            analysis__annotation_campaigns__id=annotation_campaign_id,
            start__gte=min_datetime,
            end__lte=max_datetime,
        )
        index_filter = Q(start__lt=current_file.start) | Q(
            start=current_file.start, id__lt=current_file.id
        )
        current_task_index = all_files.filter(index_filter).count()
        total_tasks = all_files.count()
        return {
            "current": current_task_index,
            "total": total_tasks,
        }
