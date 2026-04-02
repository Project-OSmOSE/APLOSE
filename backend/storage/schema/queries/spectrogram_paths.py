import graphene
from django.shortcuts import get_object_or_404
from django_extension.schema.permissions import GraphQLResolve, GraphQLPermissions

from backend.api.models import (
    SpectrogramAnalysisRelation,
)
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
    relation: SpectrogramAnalysisRelation = get_object_or_404(
        SpectrogramAnalysisRelation,
        spectrogram_id=spectrogram_id,
        analysis_id=analysis_id,
    )

    resolver = Resolver(join(relation.analysis.dataset.path, relation.analysis.path))
    paths = resolver.get_spectrogram_paths(relation=relation)
    return SpectrogramPathsNode(
        audio_path=paths[0],
        spectrogram_path=paths[1],
    )


SpectrogramPathsField = graphene.Field(
    SpectrogramPathsNode,
    spectrogram_id=graphene.ID(required=True),
    analysis_id=graphene.ID(required=True),
    resolver=resolve_paths,
)
__all__ = ["SpectrogramPathsField"]
