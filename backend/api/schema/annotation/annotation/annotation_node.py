import graphene
from django.db.models import QuerySet, Q
from django_filters import BooleanFilter

from backend.api.models import Annotation
from backend.api.schema.queries.annotation import AnnotationValidationNode
from backend.utils.schema import AuthenticatedDjangoConnectionField
from backend.utils.schema.filters import BaseFilterSet, IDFilter
from backend.utils.schema.types import BaseObjectType, BaseNode
from ..acoustic_features.features_node import AcousticFeaturesNode
from ..annotation_comment.comment_node import AnnotationCommentNode


class AnnotationFilter(BaseFilterSet):
    """Annotation filters"""

    acoustic_features__exists = BooleanFilter(
        field_name="acoustic_features", lookup_expr="isnull", exclude=True
    )
    is_valid = BooleanFilter(method="fake")
    annotator = IDFilter(method="fake")

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = Annotation
        fields = {
            "confidence__label": ("exact",),
            "label__name": ("exact",),
            "detector_configuration__detector": ("exact",),
        }

    def fake(self, queryset, name, value):
        """Fake filter method - Filter is directly used in the filter_queryset method"""
        return queryset

    def filter_queryset(self, queryset: QuerySet[Annotation]):
        annotator_id = self.data.get("annotator")
        if annotator_id:
            if self.data.get("is_valid") is not None:
                queryset = queryset.filter(
                    Q(annotator_id=annotator_id)
                    | Q(
                        validations__annotator_id=annotator_id,
                        is_update_of__validations__is_valid=self.data.get("is_valid"),
                    )
                )
            else:
                queryset = queryset.filter(annotator_id=annotator_id)

        return super().filter_queryset(queryset)


class AnnotationType(graphene.Enum):
    """From Annotation.Type"""

    Weak = "W"
    Point = "P"
    Box = "B"


class AnnotationNode(BaseObjectType):
    """Annotation schema"""

    type = AnnotationType(required=True)
    validations = AuthenticatedDjangoConnectionField(AnnotationValidationNode)
    acoustic_features = AcousticFeaturesNode()
    comments = AuthenticatedDjangoConnectionField(
        AnnotationCommentNode, source="annotation_comments"
    )

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = Annotation
        fields = "__all__"
        filterset_class = AnnotationFilter
        interfaces = (BaseNode,)
