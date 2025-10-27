"""API GraphQL schemas"""
import graphene

from .annotation import AnnotationMutation, AnnotationQuery
from .mutations import ImportAnalysisMutation, ImportDatasetMutation
from .queries import (
    AllSpectrogramAnalysisField,
    AllAnalysisForImportField,
    AllDatasetForImportField,
    AllDatasetField,
    DatasetByIdField,
)


class APIMutation(
    AnnotationMutation,
    graphene.ObjectType,
):  # pylint: disable=too-few-public-methods
    """API GraphQL mutations"""

    # Dataset
    import_dataset = ImportDatasetMutation.Field()

    # Spectrogram analysis
    import_spectrogram_analysis = ImportAnalysisMutation.Field()


class APIQuery(
    AnnotationQuery,
    graphene.ObjectType,
):  # pylint: disable=too-few-public-methods
    """API GraphQL queries"""

    # Dataset
    all_datasets_for_import = AllDatasetForImportField
    all_datasets = AllDatasetField
    dataset_by_id = DatasetByIdField

    # Spectrogram analysis
    all_spectrogram_analysis = AllSpectrogramAnalysisField
    all_analysis_for_import = AllAnalysisForImportField
