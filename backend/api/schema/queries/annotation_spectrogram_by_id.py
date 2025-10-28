import graphene

from backend.api.models import Spectrogram
from backend.api.schema.nodes import AnnotationSpectrogramNode
from backend.utils.schema import GraphQLPermissions, GraphQLResolve


@GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
def resolve_spectrogram(self, info, id: int):  # pylint: disable=redefined-builtin
    return Spectrogram.objects.get(pk=id)


AnnotationSpectrogramByIdField = graphene.Field(
    AnnotationSpectrogramNode,
    id=graphene.ID(required=True),
    resolver=resolve_spectrogram,
)
