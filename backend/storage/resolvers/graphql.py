from pathlib import PureWindowsPath
from typing import Tuple

from graphql import GraphQLError

from backend.storage.resolvers import AbstractOSEkitResolver
from backend.storage.schema.nodes import (
    FolderNode,
    DatasetStorageNode,
    AnalysisStorageNode,
)
from backend.storage.types import ImportStatus
from .model import ModelResolver
from .osekit import OSEkitResolver
from .storage import StorageResolver

__all__ = ["GraphQLResolver"]

from ...utils.osekit_replace import SpectroDataset, OSEkitDataset

Node = FolderNode | DatasetStorageNode | AnalysisStorageNode
Resolver = StorageResolver | AbstractOSEkitResolver | ModelResolver


class GraphQLResolver:
    """Class resolver for GraphQL operations"""

    @staticmethod
    def get(path: str | None = None):
        """Get model resolver"""
        return GraphQLResolver(storage=StorageResolver.get(), path=path)

    storage: StorageResolver
    path: str
    model: ModelResolver

    def __init__(self, storage: StorageResolver, path: str):
        self.storage = storage
        self.path = self.storage.clean_path(path)
        self.model = ModelResolver.get(path)

        if PureWindowsPath(self.path).anchor:
            # If the path as an anchor (is root), we shouldn't resolve
            raise GraphQLError(f"You should request non route path: {self.path}")

        if not self.storage.exists(self.path):
            raise GraphQLError(
                f"Path does not exists: {self.storage.absolute_server_path(self.path)}"
            )

    def __get_node_from_model(self, path: str) -> tuple[Node, ModelResolver] | None:
        model_resolver = ModelResolver.get(path)
        if model_resolver.analysis is not None:
            return (
                AnalysisStorageNode.from_model(model=model_resolver.analysis),
                model_resolver,
            )

        if model_resolver.dataset is not None:
            status = ImportStatus.Imported
            osekit_resolver = OSEkitResolver.get(path)
            for analysis in osekit_resolver.all_analysis:
                if not self.model.get_analysis(
                    self.storage.clean_path(analysis.folder)
                ):
                    status = ImportStatus.Partial
                    break
            return (
                DatasetStorageNode.from_model(
                    model=model_resolver.dataset, import_status=status
                ),
                model_resolver,
            )
        return None

    def __get_analysis_node_from_osekit(
        self, sd: SpectroDataset, d: OSEkitDataset
    ) -> Node:
        relative_path = (
            self.storage.clean_path(sd.folder)
            .split(self.storage.clean_path(d.folder))
            .pop()
            .strip("/")
        )
        return AnalysisStorageNode(
            name=sd.name,
            path=relative_path,
        )

    def __get_node_from_osekit(
        self, path: str
    ) -> tuple[Node, AbstractOSEkitResolver] | None:
        osekit_resolver = OSEkitResolver.get(path)
        if osekit_resolver.analysis:
            return (
                self.__get_analysis_node_from_osekit(
                    sd=osekit_resolver.analysis,
                    d=osekit_resolver.dataset,
                ),
                osekit_resolver,
            )
        if osekit_resolver.dataset:
            return (
                DatasetStorageNode(
                    name=self.storage.get_folder_name(osekit_resolver.dataset.folder),
                    path=self.storage.clean_path(osekit_resolver.dataset.folder),
                ),
                osekit_resolver,
            )
        return None

    def __get_node_from_folder(self, path: str) -> Tuple[Node, StorageResolver] | None:
        # Is folder perhaps?
        if self.storage.is_file(path):
            raise GraphQLError(f"Cannot get file node: {path}")
        else:
            node = FolderNode(path=path, name=self.storage.get_folder_name(path))
        return node, self.storage

    def get_node(self, path: str | None = None) -> Tuple[Node, Resolver]:
        """Get content"""
        if not path:
            path = self.path
        node: Node

        return (
            self.__get_node_from_model(path)
            or self.__get_node_from_osekit(path)
            or self.__get_node_from_folder(path)
        )

    def list_inner_nodes(self) -> list[Node]:
        """List inner content"""
        current_node, resolver = self.get_node()
        if isinstance(current_node, FolderNode):
            return [
                self.get_node(path)[0] for path in self.storage.list_folders(self.path)
            ]
        if isinstance(current_node, DatasetStorageNode):
            return [
                self.__get_analysis_node_from_osekit(d=resolver.dataset, sd=a)
                for a in resolver.all_analysis
            ]
        if isinstance(current_node, AnalysisStorageNode):
            raise GraphQLError(f"Analysis has no inner nodes: {self.path}")
        return []
