import graphene
from django.db import transaction
from django_extension.schema.permissions import GraphQLResolve, GraphQLPermissions
from graphene import Mutation, String
from graphql import GraphQLError

from backend.api.schema.nodes import SpectrogramAnalysisNode
from ...resolvers import ModelResolver, OSEkitResolver


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
        model_resolver = ModelResolver.get(dataset_path)
        dataset = model_resolver.get_or_create_dataset(owner=info.context.user)

        osekit_resolver = OSEkitResolver.get(dataset_path)
        spectro_dataset = next(
            a for a in osekit_resolver.all_analysis if a.name == name
        )

        if spectro_dataset is None:
            raise GraphQLError("Analysis not found")

        if dataset.spectrogram_analysis.filter(name=name).exists():
            raise GraphQLError("Analysis already imported")

        analysis = model_resolver.import_analysis(
            owner=info.context.user,
            name=name,
        )

        return ImportAnalysisMutation(analysis=analysis)


ImportAnalysisMutationField = ImportAnalysisMutation.Field()
__all__ = ["ImportAnalysisMutationField", "ImportAnalysisMutation"]
