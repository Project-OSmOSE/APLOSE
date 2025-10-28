from backend.api.schema.connections import AnnotationFileRangeConnectionField
from backend.api.schema.nodes import AnnotationFileRangeNode

AllAnnotationFileRangesField = AnnotationFileRangeConnectionField(
    AnnotationFileRangeNode
)
