from django.conf import settings
from django.db import transaction
from django.db.models import Min, Max
from django_extension.schema.permissions import GraphQLResolve, GraphQLPermissions
from django_extension.schema.errors import NotFoundError
from graphene import Boolean, Mutation, String

from backend.api.models import Dataset, SpectrogramAnalysis, Spectrogram
from backend.storage.schema.resolver import Dataset as DatasetResolver, get_resolver

__all__ = ["ImportAnalysisMutationField"]


class ImportAnalysisMutation(Mutation):
    """ "Import Analysis mutation"""

    class Arguments:
        dataset_path = String(required=True)
        name = String(required=True)

    ok = Boolean()

    @GraphQLResolve(permission=GraphQLPermissions.STAFF_OR_SUPERUSER)
    @transaction.atomic
    def mutate(self, info, dataset_path: str, name: str):
        """Do the mutation: create required analysis"""
        storage_dataset: DatasetResolver = get_resolver(
            settings.DATASET_EXPORT_PATH, dataset_path
        )
        dataset = storage_dataset.model
        if dataset is None:
            dataset = Dataset.objects.create(
                name=storage_dataset.name,
                path=storage_dataset.path,
                owner=info.context.user,
                legacy=storage_dataset.is_legacy(),
            )

        storage_analysis = storage_dataset.get_analysis(name)
        if storage_analysis is None:
            raise NotFoundError()

        if SpectrogramAnalysis.objects.filter(
            dataset_id=dataset.id, name=name
        ).exists():
            return ImportAnalysisMutation(ok=False)

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

        return ImportAnalysisMutation(ok=True)


ImportAnalysisMutationField = ImportAnalysisMutation.Field()
