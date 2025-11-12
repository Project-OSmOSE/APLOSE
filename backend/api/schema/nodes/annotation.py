from backend.api.models import Annotation
from backend.api.schema.enums import AnnotationType
from backend.api.schema.filter_sets import AnnotationFilterSet
from backend.utils.schema import AuthenticatedDjangoConnectionField
from backend.utils.schema.types import BaseObjectType, BaseNode
from .acoustic_features import AcousticFeaturesNode
from .annotation_comment import AnnotationCommentNode
from .annotation_validation import AnnotationValidationNode


class AnnotationNode(BaseObjectType):
    """Annotation schema"""

    type = AnnotationType(required=True)
    acoustic_features = AcousticFeaturesNode()

    validations = AuthenticatedDjangoConnectionField(AnnotationValidationNode)
    comments = AuthenticatedDjangoConnectionField(
        AnnotationCommentNode, source="annotation_comments"
    )

    class Meta:
        model = Annotation
        fields = "__all__"
        filterset_class = AnnotationFilterSet
        interfaces = (BaseNode,)
