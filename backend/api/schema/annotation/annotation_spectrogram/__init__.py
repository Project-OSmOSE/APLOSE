import graphene

from backend.api.models import Spectrogram
from .connection import AnnotationSpectrogramConnectionField
from .node import AnnotationSpectrogramNode


class AnnotationSpectrogramQuery(graphene.ObjectType):
    """Annotation spectrogram query"""

    all_annotation_spectrogram = AnnotationSpectrogramConnectionField(
        AnnotationSpectrogramNode,
    )

    annotation_spectrogram_by_id = graphene.Field(
        AnnotationSpectrogramNode, id=graphene.ID()
    )

    def resolve_annotation_spectrogram_by_id(self, info, id: int):
        return Spectrogram.objects.get(pk=id)
