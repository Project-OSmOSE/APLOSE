import graphene
from django.conf import settings
from django.db import transaction
from django.db.models import Min, Max
from django_extension.schema.errors import NotFoundError
from django_extension.schema.permissions import GraphQLResolve, GraphQLPermissions
from graphene import Mutation, String
from graphql import GraphQLError

from backend.api.models import Dataset, SpectrogramAnalysis, Spectrogram
from backend.api.schema import SpectrogramAnalysisNode
from backend.storage.resolvers import (
    GraphQLResolver,
    LegacyOSEkitResolver,
    OSEkitResolver,
    ModelResolver,
)
from backend.storage.schema.nodes import FolderNode, DatasetStorageNode
from backend.storage.schema.resolver import (
    Dataset as DatasetResolver,
    get_resolver,
    Folder,
)

__all__ = ["ImportAnalysisMutationField", "ImportAnalysisMutation"]


class ImportAnalysisMutation(Mutation):
    """ "Import Analysis mutation"""

    class Arguments:
        dataset_path = String(required=True)
        name = String(required=True)

    analysis = graphene.Field(SpectrogramAnalysisNode, required=True)

    @GraphQLResolve(permission=GraphQLPermissions.STAFF_OR_SUPERUSER)
    @transaction.atomic
    def mutate(self, info, dataset_path: str, name: str):
        """Do the mutation: create required analysis"""
        gql_resolver = GraphQLResolver.get(dataset_path)
        if not isinstance(gql_resolver.get_node(), DatasetStorageNode):
            raise GraphQLError(f"Cannot get dataset for path: {dataset_path}")

        dataset_model_resolver = ModelResolver.get(dataset_path)
        dataset = dataset_model_resolver.get_or_create_dataset(owner=info.context.user)

        if dataset.spectrogram_analysis.filter(name=name).exists():
            raise GraphQLError(
                f"Analysis {name} is already imported for dataset {dataset.name}"
            )

        analysis = SpectrogramAnalysis.objects.import_for_dataset(
            dataset,
            name,
            storage_analysis.relative_path,
            owner=info.context.user,
        )
        Spectrogram.objects.import_all_for_analysis(analysis)

        info = analysis.spectrograms.aggregate(start=Min("start"), end=Max("end"))
        analysis.start = info["start"]
        analysis.end = info["end"]
        analysis.save()

        return ImportAnalysisMutation(analysis=analysis)


ImportAnalysisMutationField = ImportAnalysisMutation.Field()
