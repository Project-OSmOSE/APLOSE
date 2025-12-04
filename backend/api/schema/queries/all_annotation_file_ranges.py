from backend.api.schema.nodes import AnnotationFileRangeNode
from backend.utils.schema import AuthenticatedDjangoConnectionField

AllAnnotationFileRangesField = AuthenticatedDjangoConnectionField(
    AnnotationFileRangeNode
)
