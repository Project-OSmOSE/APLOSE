import os
from io import TextIOWrapper
from pathlib import PureWindowsPath, Path

from django.conf import settings

_Path = str | Path | PureWindowsPath


def clean_path(path: _Path) -> str:
    """Format path for both UNIX and Windows usage"""
    return PureWindowsPath(path).as_posix()


def make_path_relative(path: _Path, to: _Path | None = None) -> str:
    """Clean the path"""
    path: str = clean_path(path)
    to: str = clean_path(to or settings.DATASET_EXPORT_PATH)
    has_storage = to is not None and len(to) > 0 and to != "." and to != "/"
    root = clean_path(settings.VOLUMES_ROOT)
    if root in path and not has_storage:
        # Path should be relative
        return path.split(root).pop().strip("/")
    if to in path and has_storage:
        # Path should be relative
        return path.split(to).pop().strip("/")
    return clean_path(path)


def join(a: str, /, *paths: str) -> str:
    """Join multiple paths"""
    return clean_path(os.path.join(a, *paths))


def make_absolute_server(path: _Path, storage: _Path | None = None) -> str:
    """Get absolute server path"""
    _storage: str = clean_path(storage or settings.DATASET_EXPORT_PATH)
    return join(
        clean_path(settings.VOLUMES_ROOT),
        _storage,
        make_path_relative(path, to=_storage),
    )


def make_static_url(path: _Path, storage: _Path | None = None) -> str:
    """Get absolute server path"""
    _storage: str = clean_path(storage or settings.DATASET_EXPORT_PATH)
    return join(
        clean_path(settings.STATIC_URL),
        _storage,
        make_path_relative(path, to=_storage),
    )


def exists(path: _Path) -> bool:
    """Check if path exists"""
    return os.path.exists(make_absolute_server(path))


def open_file(path: _Path, encoding="utf-8") -> TextIOWrapper:
    """Open the file at path"""
    return open(make_absolute_server(path), encoding=encoding)


def isfile(path: _Path) -> bool:
    """Check if path is a file"""
    return os.path.isfile(make_absolute_server(path))


def listdir(path: _Path) -> list[str]:
    """List all content in path"""
    return [join(path, item) for item in os.listdir(make_absolute_server(path))]


def is_local_root(path: _Path) -> bool:
    """If path is a local root"""
    path = clean_path(path)
    return path == "" or path == "." or path == "/"
