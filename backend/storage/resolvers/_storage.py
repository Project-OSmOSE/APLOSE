from pathlib import PureWindowsPath

from backend.storage.exceptions import (
    PathNotFoundException,
    RootPathException,
    CannotGetChildrenException,
)
from backend.storage.utils import exists, isfile, listdir
from backend.storage.types import StorageFolder

from ._abstract import AbstractResolver


class StorageResolver(AbstractResolver):

    __path: str

    def __init__(self, path: str):
        if PureWindowsPath(path).anchor:
            # If the path as an anchor (is root), we shouldn't resolve
            raise RootPathException(path)
        if not exists(path):
            raise PathNotFoundException(path)
        super().__init__(path)

    def get_child_items(self) -> list[StorageFolder]:
        if isfile(self.path):
            raise CannotGetChildrenException(self.path)
        return [
            StorageFolder(path=child_path)
            for child_path in listdir(self.path)
            if not isfile(child_path)
        ]
