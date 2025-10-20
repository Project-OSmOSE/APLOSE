from graphene import ObjectType, NonNull, String, Boolean, List

from ..spectrogram_analysis import ImportSpectrogramAnalysisType


class ImportDatasetType(ObjectType):  # pylint: disable=too-few-public-methods
    """Type for import dataset"""

    name = NonNull(String)
    path = NonNull(String)
    legacy = Boolean()
    analysis = List(ImportSpectrogramAnalysisType)
