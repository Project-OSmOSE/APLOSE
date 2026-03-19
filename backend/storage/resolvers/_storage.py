from pathlib import PureWindowsPath

from backend.storage.exceptions import (
    PathNotFoundException,
    RootPathException,
)
from backend.storage.utils import exists, make_path_relative
from ._abstract import AbstractResolver


class StorageResolver(AbstractResolver):
    def __init__(self, path: str | None):
        if path is not None:
            path = make_path_relative(path)
            if PureWindowsPath(path).anchor:
                # If the path as an anchor (is root), we shouldn't resolve
                raise RootPathException(path)
            if not exists(path):
                raise PathNotFoundException(path)
        super().__init__(path)
