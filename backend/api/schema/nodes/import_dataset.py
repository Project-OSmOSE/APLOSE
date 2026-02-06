from graphene import ObjectType, NonNull, String, Boolean, List

from .import_analysis import ImportAnalysisNode


class ImportDatasetNode(ObjectType):
    """Type for import dataset"""

    name = NonNull(String)
    path = NonNull(String)
    legacy = Boolean()
    analysis = List(ImportAnalysisNode)

    failed = Boolean()
    stack = String()
