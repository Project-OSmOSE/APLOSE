"""SpectrogramAnalysis schema"""

from django.db import transaction
from graphene import (
    ObjectType,
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


class ImportSpectrogramAnalysisMutation(Mutation):
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
        dataset: Dataset = Dataset.objects.get_or_create(
            name=kwargs.pop("dataset_name"),
            path=kwargs.pop("dataset_path"),
            owner=info.context.user,
            legacy=kwargs.pop("legacy"),
        )
        name = kwargs.pop("name")
        path = kwargs.pop("path")
        if SpectrogramAnalysis.objects.filter(dataset=dataset, name=name).exists():
            return ImportSpectrogramAnalysisMutation(ok=False)

        analysis = SpectrogramAnalysis.objects.import_for_dataset(
            dataset, name, path, owner=info.context.user
        )
        Spectrogram.objects.import_all_for_analysis(analysis)

        return ImportSpectrogramAnalysisMutation(ok=True)


class SpectrogramAnalysisMutation(ObjectType):  # pylint: disable=too-few-public-methods
    """SpectrogramAnalysis mutations"""

    import_spectrogram_analysis = ImportSpectrogramAnalysisMutation.Field()
