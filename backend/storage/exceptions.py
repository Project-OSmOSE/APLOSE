class BaseException(Exception):
    """Common base class for all non-exit exceptions."""

    message: str

    def __init__(self, message: str):
        self.message = message
        super().__init__(message)


class InvalidFolderException(BaseException):
    def __init__(self, path: str):
        super().__init__(f"Cannot get folder at path: {path}")


__all__ = [
    "InvalidFolderException",
]
