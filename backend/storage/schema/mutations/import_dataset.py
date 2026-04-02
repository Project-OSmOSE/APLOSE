import graphene
from django.db import transaction
from django.forms import model_to_dict
from django_extension.schema.permissions import GraphQLResolve, GraphQLPermissions
from graphene import Mutation, String
from graphql import GraphQLError

from backend.api.admin.data.spectrogram_analysis import store_paths
from backend.api.models import (
    FFT,
    Colormap,
)
from backend.api.schema import DatasetNode
from backend.api.schema.nodes import SpectrogramAnalysisNode
from backend.storage.resolvers import Resolver
from backend.storage.types import FailedItem
from backend.storage.utils import join


class ImportDatasetMutation(Mutation):
    """ "Import Analysis mutation"""

    class Arguments:
        dataset_path = String(required=True)
        analysis_path = String()

    dataset = graphene.Field(DatasetNode, required=True)
    analysis = graphene.Field(SpectrogramAnalysisNode)

    @GraphQLResolve(permission=GraphQLPermissions.STAFF_OR_SUPERUSER)
    @transaction.atomic
    def mutate(self, info, dataset_path: str, analysis_path: str | None = None):
        """Do the mutation: create required analysis"""

        full_path = join(dataset_path, analysis_path or "")
        resolver = Resolver(full_path)

        if not resolver.dataset:
            raise GraphQLError("Dataset not found")
        if isinstance(resolver.dataset, FailedItem):
            raise GraphQLError(
                str(resolver.dataset.error), original_error=resolver.dataset.error
            )
        if resolver.dataset.pk is None:
            resolver.dataset.owner = info.context.user
        resolver.dataset.save()

        analysis = []
        if analysis_path:
            if isinstance(resolver.analysis, FailedItem):
                raise GraphQLError(
                    str(resolver.analysis.error), original_error=resolver.analysis.error
                )
            analysis.append(resolver.get_analysis(path=full_path, detailed=True))
        else:
            for a in resolver.get_all_analysis(detailed=True):
                if isinstance(a, FailedItem):
                    continue
                analysis.append(a)

        for sa in analysis:
            if sa.pk is not None:
                continue
            sa.owner = info.context.user
            sa.dataset = resolver.dataset

            sa.fft, _ = FFT.objects.get_or_create(**model_to_dict(sa.fft))
            sa.colormap, _ = Colormap.objects.get_or_create(name=sa.colormap.name)
            sa.save()

            resolver.create_legacy_configuration(sa)

            spectrograms = resolver.get_all_spectrograms_for_analysis(analysis=sa)
            sa.add_spectrograms(spectrograms=spectrograms)
            store_paths(analysis=sa)

        return ImportDatasetMutation(
            dataset=resolver.dataset,
            analysis=analysis.pop() if analysis_path else None,
        )


ImportDatasetMutationField = ImportDatasetMutation.Field()
__all__ = ["ImportDatasetMutationField", "ImportDatasetMutation"]
