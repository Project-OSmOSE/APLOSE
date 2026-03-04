from io import TextIOWrapper
from os import listdir
from os.path import join, exists, isfile
from pathlib import PureWindowsPath, Path

from django.conf import settings

__all__ = ["StorageResolver"]

from backend.storage.exceptions import InvalidFolderException
from backend.storage.types import StorageFolder

_Path = str | Path | PureWindowsPath


class StorageResolver:
    """Resolver class for storage management"""

    @staticmethod
    def get():
        """Get storage resolver"""
        return StorageResolver(storage_root=settings.DATASET_EXPORT_PATH)

    server_root: str
    storage_root: str

    @property
    def storage_server_path(self) -> str:
        """Path to the storage server"""
        return StorageResolver.join(self.server_root, self.storage_root)

    def __init__(self, storage_root: _Path):
        self.server_root = StorageResolver.format_path(settings.VOLUMES_ROOT)
        self.storage_root = StorageResolver.format_path(storage_root)

    def clean_path(self, path: _Path) -> str:
        """Clean the path"""
        path = self.format_path(path)
        has_storage_root = (
            len(self.storage_root) > 0
            and self.storage_root != "."
            and self.storage_root != "/"
        )
        if self.server_root in path and not has_storage_root:
            # Path should be relative
            return path.split(self.server_root).pop().strip("/")
        if self.storage_root in path and has_storage_root:
            # Path should be relative
            return path.split(self.storage_root).pop().strip("/")
        return self.format_path(path)

    @staticmethod
    def format_path(path: _Path) -> str:
        """Format path for both UNIX and Windows usage"""
        return PureWindowsPath(path).as_posix()

    def absolute_server_path(self, path: _Path) -> str:
        """Get absolute server path"""
        return StorageResolver.join(self.storage_server_path, self.clean_path(path))

    def absolute_static_path(self, path: _Path) -> str:
        """Get absolute server path"""
        return StorageResolver.join(
            self.format_path(settings.STATIC_URL),
            self.storage_root,
            self.clean_path(path),
        )

    def exists(self, path: _Path) -> bool:
        """Check if path exists"""
        return exists(self.absolute_server_path(path))

    def is_file(self, path: _Path) -> bool:
        """Check if path is a file"""
        return isfile(self.absolute_server_path(path))

    def list(self, path: _Path) -> list[str]:
        """List all content in path"""
        return [
            StorageResolver.join(path, item)
            for item in listdir(self.absolute_server_path(path))
        ]

    def list_folders(self, path: _Path):
        """List all folders in path"""
        return [
            item_path
            for item_path in self.list(path)
            if self.exists(item_path)
            if not self.is_file(item_path)
        ]

    def open(self, path: _Path, encoding="utf-8") -> TextIOWrapper:
        """Open the file at path"""
        return open(self.absolute_server_path(path), encoding=encoding)

    @staticmethod
    def get_parent(path: _Path) -> str:
        """Get parent folder of the path"""
        return StorageResolver.format_path(PureWindowsPath(path).parent)

    @staticmethod
    def join(a: str, /, *paths: str) -> str:
        """Join multiple paths"""
        return StorageResolver.format_path(join(a, *paths))

    @staticmethod
    def get_folder_name(path: _Path) -> str:
        """Get folder name for the path"""
        return PureWindowsPath(path).stem

    @staticmethod
    def is_local_root(path: _Path) -> bool:
        """If path is a local root"""
        path = StorageResolver.format_path(path)
        return path == "" or path == "." or path == "/"

    def get_folder(self, path) -> StorageFolder:
        if self.is_file(path):
            raise InvalidFolderException(path)
        return StorageFolder(path)
