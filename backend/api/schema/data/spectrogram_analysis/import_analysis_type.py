from graphene import ObjectType, NonNull, String


class ImportSpectrogramAnalysisType(
    ObjectType
):  # pylint: disable=too-few-public-methods
    """Type for import dataset"""

    name = NonNull(String)
    path = NonNull(String)
