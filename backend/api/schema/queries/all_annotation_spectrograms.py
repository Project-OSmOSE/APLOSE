from backend.api.schema.connections import AnnotationSpectrogramConnectionField
from backend.api.schema.nodes import AnnotationSpectrogramNode

AllAnnotationSpectrogramsField = AnnotationSpectrogramConnectionField(
    AnnotationSpectrogramNode
)
