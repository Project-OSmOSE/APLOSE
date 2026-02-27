from .__abstract import AbstractOSEkitResolver
from .legacy import LegacyOSEkitResolver
from .current import OSEkitResolver as CurrentOSEkitResolver
from ..storage import StorageResolver


class OSEkitResolver:
    """Resolver class for OSEkit related content"""

    @staticmethod
    def get(path: str | None) -> AbstractOSEkitResolver:
        storage = StorageResolver.get()
        legacy = LegacyOSEkitResolver(storage, path)
        if legacy.dataset is not None:
            return legacy
        return CurrentOSEkitResolver(storage, path)
