import graphene
from django.db import transaction
from django_extension.schema.permissions import GraphQLResolve, GraphQLPermissions
from graphene import Mutation, String
from graphql import GraphQLError

from backend.api.models import Dataset
from backend.api.schema import DatasetNode
from backend.api.schema.nodes import SpectrogramAnalysisNode
from backend.storage.utils import join, make_path_relative
from backend.storage.resolvers import Resolver


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
        resolver = Resolver(join(dataset_path, analysis_path or ""))

        dataset: Dataset = resolver.model.get_or_create_dataset(owner=info.context.user)

        if analysis_path:
            storage_analysis = resolver.get_analysis()
            if storage_analysis is None:
                raise GraphQLError("Analysis not found")

            if dataset.spectrogram_analysis.filter(path=analysis_path).exists():
                raise GraphQLError("Analysis already imported")

            analysis = resolver.model.create_analysis(owner=info.context.user)

            return ImportDatasetMutation(analysis=analysis, dataset=dataset)
        else:
            for sd in resolver.osekit.get_all_spectro_dataset():
                relative_path = make_path_relative(sd.folder, to=dataset.path)
                if dataset.spectrogram_analysis.filter(path=relative_path).exists():
                    continue
                resolver.model.create_analysis(
                    owner=info.context.user, spectro_dataset=sd
                )
        return ImportDatasetMutation(dataset=dataset)


ImportDatasetMutationField = ImportDatasetMutation.Field()
__all__ = ["ImportDatasetMutationField", "ImportDatasetMutation"]
