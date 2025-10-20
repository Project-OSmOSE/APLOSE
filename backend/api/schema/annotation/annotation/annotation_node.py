import graphene
from django_filters import BooleanFilter

from backend.api.models import Annotation
from backend.api.schema.queries.annotation import AnnotationValidationNode
from backend.utils.schema import AuthenticatedDjangoConnectionField
from backend.utils.schema.filters import BaseFilterSet
from backend.utils.schema.types import BaseObjectType, BaseNode
from ..acoustic_features.features_node import AcousticFeaturesNode
from ..annotation_comment.comment_node import AnnotationCommentNode


class AnnotationFilter(BaseFilterSet):
    """Annotation filters"""

    acoustic_features__exists = BooleanFilter(
        field_name="acoustic_features", lookup_expr="isnull", exclude=True
    )

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = Annotation
        fields = {
            "annotator": ("exact",),
            "confidence__label": ("exact",),
            "label__name": ("exact",),
            "detector_configuration__detector": ("exact",),
        }


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
