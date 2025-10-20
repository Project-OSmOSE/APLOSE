from graphene import ObjectType, List, ID

from backend.api.models import Dataset
from backend.utils.schema import (
    AuthenticatedDjangoConnectionField,
    GraphQLPermissions,
    GraphQLResolve,
)
from .all_analysis_for_import import (
    legacy_resolve_all_spectrogram_analysis_available_for_import,
    resolve_all_spectrogram_analysis_available_for_import,
)
from .analysis_node import SpectrogramAnalysisNode
from .import_analysis_mutation import ImportSpectrogramAnalysisMutation
from .import_analysis_type import ImportSpectrogramAnalysisType


class SpectrogramAnalysisQuery(ObjectType):  # pylint: disable=too-few-public-methods
    """SpectrogramAnalysis queries"""

    all_spectrogram_analysis = AuthenticatedDjangoConnectionField(
        SpectrogramAnalysisNode
    )

    all_spectrogram_analysis_for_import = List(
        ImportSpectrogramAnalysisType, dataset_id=ID(required=True)
    )

    @GraphQLResolve(permission=GraphQLPermissions.STAFF_OR_SUPERUSER)
    def resolve_all_spectrogram_analysis_for_import(self, _, dataset_id: int):
        """Get all datasets for import"""
        dataset = Dataset.objects.get(pk=dataset_id)

        if dataset.legacy:
            return legacy_resolve_all_spectrogram_analysis_available_for_import(
                dataset_name=dataset.name,
                dataset_path=dataset.path,
                config_folder=dataset.get_config_folder(),
            )

        return resolve_all_spectrogram_analysis_available_for_import(
            dataset=dataset.get_osekit_dataset(), folder=dataset.path
        )


class SpectrogramAnalysisMutation(ObjectType):  # pylint: disable=too-few-public-methods
    """SpectrogramAnalysis mutations"""

    import_spectrogram_analysis = ImportSpectrogramAnalysisMutation.Field()
