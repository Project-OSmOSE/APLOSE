from pathlib import PureWindowsPath

import graphene
from django.shortcuts import get_object_or_404
from django_extension.schema.permissions import GraphQLResolve, GraphQLPermissions

from backend.api.models import Spectrogram, SpectrogramAnalysis
from ...resolvers import StorageResolver, OSEkitResolver


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
    storage = StorageResolver.get()
    osekit_resolver = OSEkitResolver.get(
        storage.join(analysis.dataset.path, analysis.path)
    )

    audio_path = None
    if osekit_resolver.analysis:
        for spectro_data in osekit_resolver.analysis.data:
            for file in spectro_data.audio_data.files:
                if PureWindowsPath(file.path).stem == spectrogram.filename:
                    audio_path = storage.absolute_static_path(file.path)

    spectrogram_path = None
    for file in osekit_resolver.get_analysis_spectro_files(osekit_resolver.analysis):
        if PureWindowsPath(file.path).name == spectrogram.filename:
            spectrogram_path = storage.absolute_static_path(file.path)

    return SpectrogramPathsNode(
        audio_path=audio_path, spectrogram_path=spectrogram_path
    )


SpectrogramPathsField = graphene.Field(
    SpectrogramPathsNode,
    spectrogram_id=graphene.ID(required=True),
    analysis_id=graphene.ID(required=True),
    resolver=resolve_paths,
)
__all__ = ["SpectrogramPathsField"]
