import graphene
from django.shortcuts import get_object_or_404
from django_extension.schema.permissions import GraphQLResolve, GraphQLPermissions

from backend.api.models import Spectrogram, SpectrogramAnalysis
from backend.storage.resolvers import Resolver
from backend.storage.utils import join


class SpectrogramPathsNode(graphene.ObjectType):

    audio_path = graphene.String()
    spectrogram_path = graphene.String()

    def __init__(self, audio_path, spectrogram_path):
        super().__init__()
        self.audio_path = audio_path
        self.spectrogram_path = spectrogram_path


@GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
def resolve_paths(root, info, spectrogram_id: int, analysis_id: int):
    spectrogram: Spectrogram = get_object_or_404(Spectrogram, pk=spectrogram_id)
    analysis: SpectrogramAnalysis = get_object_or_404(
        spectrogram.analysis.all(), pk=analysis_id
    )

    resolver = Resolver(join(analysis.dataset.path, analysis.path))
    return SpectrogramPathsNode(
        audio_path=resolver.get_audio_path(spectrogram),
        spectrogram_path=resolver.get_spectrogram_path(spectrogram),
    )


SpectrogramPathsField = graphene.Field(
    SpectrogramPathsNode,
    spectrogram_id=graphene.ID(required=True),
    analysis_id=graphene.ID(required=True),
    resolver=resolve_paths,
)
__all__ = ["SpectrogramPathsField"]
