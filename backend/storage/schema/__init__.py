import graphene

from .queries import BrowseField
from .mutations import ImportAnalysisMutationField


class StorageQuery(graphene.ObjectType):
    browse = BrowseField


class StorageMutation(graphene.ObjectType):
    import_analysis = ImportAnalysisMutationField
