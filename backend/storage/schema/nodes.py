from graphene import ObjectType, NonNull, String, Field
from graphene_django_pagination import DjangoPaginationConnectionField

from backend.api.schema.nodes import DatasetNode, SpectrogramAnalysisNode
from backend.background_tasks.models import ImportAnalysisBackgroundTask
from backend.background_tasks.schema import ImportAnalysisBackgroundTaskNode
from backend.storage.types import StorageAnalysis, StorageDataset, StorageFolder

__all__ = [
    "AnalysisStorageNode",
    "DatasetStorageNode",
    "FolderNode",
]


class AnalysisStorageNode(ObjectType):
    name = NonNull(String)
    path = NonNull(String)
    model = Field(SpectrogramAnalysisNode)
    error = String()
    stack = String()

    class Meta:
        possible_types = (StorageAnalysis,)

    import_tasks = DjangoPaginationConnectionField(ImportAnalysisBackgroundTaskNode)

    def resolve_import_tasks(self: StorageAnalysis, info, **kwargs):
        return ImportAnalysisBackgroundTask.objects.filter(analysis_path=self.path)


class DatasetStorageNode(ObjectType):
    name = NonNull(String)
    path = NonNull(String)
    model = Field(DatasetNode)
    error = String()
    stack = String()

    class Meta:
        possible_types = (StorageDataset,)


class FolderNode(ObjectType):
    name = NonNull(String)
    path = NonNull(String)
    error = String()
    stack = String()

    class Meta:
        possible_types = (StorageFolder,)
