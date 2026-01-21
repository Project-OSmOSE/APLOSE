from django_extension.schema.fields import AuthenticatedPaginationConnectionField
from django_extension.schema.types import ExtendedNode

from backend.api.models import Annotation
from backend.api.schema.enums import AnnotationType
from backend.api.schema.filter_sets import AnnotationFilterSet
from .acoustic_features import AcousticFeaturesNode
from .annotation_comment import AnnotationCommentNode
from .annotation_validation import AnnotationValidationNode


class AnnotationNode(ExtendedNode):
    """Annotation schema"""

    type = AnnotationType(required=True)
    acoustic_features = AcousticFeaturesNode()

    validations = AuthenticatedPaginationConnectionField(AnnotationValidationNode)
    comments = AuthenticatedPaginationConnectionField(
        AnnotationCommentNode, source="annotation_comments"
    )

    class Meta:
        model = Annotation
        fields = "__all__"
        filterset_class = AnnotationFilterSet
