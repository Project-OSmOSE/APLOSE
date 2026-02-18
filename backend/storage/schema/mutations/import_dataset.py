from django.conf import settings
from django.db import transaction
from django_extension.schema.permissions import GraphQLResolve, GraphQLPermissions
from graphene import Boolean, Mutation, String

from backend.api.models import Dataset
from backend.storage.schema.resolver import Dataset as DatasetResolver, get_resolver
from .import_analysis import ImportAnalysisMutation

__all__ = ["ImportDatasetMutationField"]


class ImportDatasetMutation(Mutation):
    """ "Import Dataset mutation"""

    class Arguments:
        path = String(required=True)

    ok = Boolean()

    @GraphQLResolve(permission=GraphQLPermissions.STAFF_OR_SUPERUSER)
    @transaction.atomic
    def mutate(self, info, path: str):
        """Do the mutation: create required analysis"""
        storage_dataset: DatasetResolver = get_resolver(
            settings.DATASET_EXPORT_PATH, path
        )
        dataset, _ = Dataset.objects.get_or_create(
            name=storage_dataset.name,
            path=path,
            owner=info.context.user,
            legacy=storage_dataset.is_legacy(),
        )
        for analysis in storage_dataset.browse():
            analysis_mutation = ImportAnalysisMutation()
            analysis_mutation.mutate(
                info,
                dataset_path=path,
                name=analysis.name,
            )

        return ImportDatasetMutation(ok=True)


ImportDatasetMutationField = ImportDatasetMutation.Field()
