import graphene

from backend.background_tasks.types import ImportAnalysisBackgroundTask
from ._abstract_background_task import AbstractBackgroundTaskNode
from ..enums import *


class ImportAnalysisBackgroundTaskNode(AbstractBackgroundTaskNode, graphene.ObjectType):

    dataset_id = graphene.NonNull(graphene.Int)
    chunk_size = graphene.NonNull(graphene.Int)
    completed_spectrograms = graphene.NonNull(graphene.Int)
    analysis_path = graphene.NonNull(graphene.String)
    total_spectrograms = graphene.Int()
    analysis_id = graphene.Int()

    class Meta:
        possible_types = (ImportAnalysisBackgroundTask,)

    def resolve_dataset_id(self: ImportAnalysisBackgroundTask, info):
        return self.other_info["dataset_id"]

    def resolve_chunk_size(self: ImportAnalysisBackgroundTask, info):
        return self.other_info["chunk_size"]

    def resolve_completed_spectrograms(self: ImportAnalysisBackgroundTask, info):
        return self.other_info["completed_spectrograms"]

    def resolve_analysis_path(self: ImportAnalysisBackgroundTask, info):
        return self.other_info["analysis_path"]

    def resolve_total_spectrograms(self: ImportAnalysisBackgroundTask, info):
        return self.other_info["total_spectrograms"]

    def resolve_analysis_id(self: ImportAnalysisBackgroundTask, info):
        return self.other_info["analysis_id"]


__all__ = [
    "ImportAnalysisBackgroundTaskNode",
]
