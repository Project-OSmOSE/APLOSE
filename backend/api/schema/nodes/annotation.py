import graphene
import graphene_django_optimizer
from django_extension.schema.fields import AuthenticatedPaginationConnectionField
from django_extension.schema.types import ExtendedNode

from backend.api.models import Annotation
from backend.api.schema.enums import AnnotationType
from backend.api.schema.filter_sets import AnnotationFilterSet
from .acoustic_features import AcousticFeaturesNode
from .annotation_comment import AnnotationCommentNode
from .annotation_validation import AnnotationValidationNode
from .annotation_phase import AnnotationPhaseNode


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

    annotation_phase = graphene.Field(AnnotationPhaseNode, required=True)

    @graphene_django_optimizer.resolver_hints()
    def resolve_annotation_phase(self: Annotation, info):
        return self.annotation_phase
