class BaseException(Exception):
    """Common base class for all non-exit exceptions."""

    message: str

    def __init__(self, message: str):
        self.message = message
        super().__init__(message)


class PathNotFoundException(BaseException):
    def __init__(self, path: str):
        super().__init__(f"Path not found: {path}")


class RootPathException(BaseException):
    def __init__(self, path: str):
        super().__init__(f"Path is root: {path}")


class InvalidFolderException(BaseException):
    def __init__(self, path: str):
        super().__init__(f"Cannot get folder at path: {path}")


class CannotGetChildrenException(BaseException):
    def __init__(self, path: str):
        super().__init__(f"Cannot get inner children for path: {path}")


__all__ = [
    "PathNotFoundException",
    "RootPathException",
    "InvalidFolderException",
    "CannotGetChildrenException",
]
