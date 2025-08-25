"""AnnotationTask schema"""
from django_filters import FilterSet, CharFilter
from graphene import relay, Scalar
from graphene_django.filter import GlobalIDFilter
from graphql.language import ast

from backend.api.models import AnnotationTask
from backend.utils.schema import ApiObjectType


class TaskStatusEnum(Scalar):
    # pylint: disable=missing-class-docstring

    @staticmethod
    def serialize(value):
        """Serialize enum"""
        return AnnotationTask.Status(value).label

    @staticmethod
    def parse_literal(node, _variables=None):
        """Parse literal"""
        if isinstance(node, ast.StringValueNode):
            index = AnnotationTask.Status.labels.index(node.value)
            value = AnnotationTask.Status.values[index]
            return AnnotationTask.Status(value)
        return None

    @staticmethod
    def parse_value(value):
        """Parse value"""
        index = AnnotationTask.Status.labels.index(value)
        value = AnnotationTask.Status.values[index]
        return AnnotationTask.Status(value)


class AnnotationTaskFilter(FilterSet):
    """Annotation filters"""

    annotator_id = GlobalIDFilter(
        field_name="annotator_id", lookup_expr="exact", exclude=False
    )
    annotation_campaign_id = GlobalIDFilter(
        field_name="annotation_phase__annotation_campaign",
        lookup_expr="exact",
        exclude=False,
    )
    phase_type = CharFilter(
        field_name="annotation_phase__phase",
        lookup_expr="exact",
        exclude=False,
    )

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AnnotationTask
        fields = {
            "spectrogram_id": ["exact", "in"],
        }


class AnnotationTaskNode(ApiObjectType):
    """AnnotationTask schema"""

    status = TaskStatusEnum()

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AnnotationTask
        fields = "__all__"
        filterset_class = AnnotationTaskFilter
        interfaces = (relay.Node,)
