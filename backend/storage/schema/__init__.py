import graphene

from .queries import *
from .mutations import *


class StorageQuery(graphene.ObjectType):
    browse = BrowseField
    search = SearchField
    spectrogram_paths = SpectrogramPathsField


class StorageMutation(graphene.ObjectType):
    import_analysis = ImportAnalysisMutationField
    import_dataset = ImportDatasetMutationField
