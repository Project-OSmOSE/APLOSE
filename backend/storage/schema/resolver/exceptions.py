class InexistentPathException(Exception):
    def __init__(self, path):
        super().__init__(f"Path {path} does not exists.")


class FileFolderException(Exception):
    def __init__(self, path):
        super().__init__(f"Path {path} is a file, not a folder.")


class AnalysisBrowseException(Exception):
    def __init__(self, path):
        super().__init__(f"Cannot browse an analysis")


__all__ = [
    "InexistentPathException",
    "FileFolderException",
    "AnalysisBrowseException",
]
