import graphene
from django.db import transaction
from django_extension.schema.permissions import GraphQLResolve, GraphQLPermissions
from graphene import Mutation, String

from backend.api.schema.nodes import DatasetNode
from ...resolvers import ModelResolver, OSEkitResolver
from .import_analysis import ImportAnalysisMutation


class ImportDatasetMutation(Mutation):
    """ "Import Dataset mutation"""

    class Arguments:
        path = String(required=True)

    dataset = graphene.Field(DatasetNode, required=True)

    @GraphQLResolve(permission=GraphQLPermissions.STAFF_OR_SUPERUSER)
    @transaction.atomic
    def mutate(self, info, path: str):
        """Do the mutation: create required analysis"""
        model_resolver = ModelResolver.get(path)
        dataset = model_resolver.get_or_create_dataset(owner=info.context.user)
        osekit = OSEkitResolver.get(path)

        for analysis in osekit.all_analysis:
            analysis_mutation = ImportAnalysisMutation()
            analysis_mutation.mutate(
                info,
                dataset_path=path,
                name=analysis.name,
            )

        return ImportDatasetMutation(dataset=dataset)


ImportDatasetMutationField = ImportDatasetMutation.Field()
__all__ = ["ImportDatasetMutationField"]
