from backend.api.schema.enums.annotation_type import AnnotationType
from backend.utils.schema import AuthenticatedDjangoConnectionField
from backend.utils.schema.types import BaseObjectType, BaseNode
from .acoustic_features import AcousticFeaturesNode
from .annotation_comment import AnnotationCommentNode
from .annotation_validation import AnnotationValidationNode
from backend.api.models import Annotation
from backend.api.schema.filter_sets import AnnotationFilterSet


class AnnotationNode(BaseObjectType):
    """Annotation schema"""

    type = AnnotationType(required=True)
    acoustic_features = AcousticFeaturesNode()

    validations = AuthenticatedDjangoConnectionField(AnnotationValidationNode)
    comments = AuthenticatedDjangoConnectionField(
        AnnotationCommentNode, source="annotation_comments"
    )

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = Annotation
        fields = "__all__"
        filterset_class = AnnotationFilterSet
        interfaces = (BaseNode,)
