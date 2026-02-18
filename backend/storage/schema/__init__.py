import graphene

from .queries import *
from .mutations import *


class StorageQuery(graphene.ObjectType):
    browse = BrowseField
    search = SearchField


class StorageMutation(graphene.ObjectType):
    import_analysis = ImportAnalysisMutationField
    import_dataset = ImportDatasetMutationField
