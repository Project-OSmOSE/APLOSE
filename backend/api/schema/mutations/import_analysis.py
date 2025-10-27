from django.db import transaction
from graphene import (
    String,
    Mutation,
    Boolean,
)

from backend.api.models import (
    Dataset,
    SpectrogramAnalysis,
    Spectrogram,
)
from backend.utils.schema import GraphQLResolve, GraphQLPermissions


class ImportAnalysisMutation(Mutation):
    """"Import spectrogram analysis mutation""" ""

    class Arguments:  # pylint: disable=too-few-public-methods, missing-class-docstring
        dataset_name = String(required=True)
        dataset_path = String(required=True)
        legacy = Boolean()
        name = String(required=True)
        path = String(required=True)

    ok = Boolean()

    @GraphQLResolve(permission=GraphQLPermissions.STAFF_OR_SUPERUSER)
    @transaction.atomic
    def mutate(self, info, **kwargs):
        """Do the mutation: create required analysis"""
        dataset, _ = Dataset.objects.get_or_create(
            name=kwargs.pop("dataset_name"),
            path=kwargs.pop("dataset_path"),
            owner=info.context.user,
            legacy=kwargs.pop("legacy") or False,
        )
        name = kwargs.pop("name")
        path = kwargs.pop("path")
        if SpectrogramAnalysis.objects.filter(
            dataset_id=dataset.id, name=name
        ).exists():
            return ImportAnalysisMutation(ok=False)

        analysis = SpectrogramAnalysis.objects.import_for_dataset(
            dataset, name, path, owner=info.context.user
        )
        Spectrogram.objects.import_all_for_analysis(analysis)

        return ImportAnalysisMutation(ok=True)
