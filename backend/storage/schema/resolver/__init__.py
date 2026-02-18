from typing import Union

from django.conf import settings

from .types import *
from .exceptions import *
from .folder import Folder
from .analysis import Analysis
from .dataset import Dataset


def get_resolver(root: str, path: str) -> Union[Folder, Dataset]:
    resolver = Folder(root, path)
    if resolver.is_dataset():
        resolver = Dataset(root, path)
    return resolver
