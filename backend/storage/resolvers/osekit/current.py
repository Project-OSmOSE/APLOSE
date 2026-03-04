import traceback
from pathlib import Path

from backend.utils.osekit_replace import OSEkitDataset
from .__abstract import AbstractOSEkitResolver


class OSEkitResolver(AbstractOSEkitResolver):
    """Resolver class for OSEkit related content"""

    def _load_dataset(self, path: str):
        if "dataset.json" in path:
            json_path = path
        else:
            json_path = self.storage.join(path, "dataset.json")
        if self.storage.exists(json_path):
            try:
                self.dataset = OSEkitDataset.from_json(
                    Path(self.storage.absolute_server_path(json_path))
                )
                return None
            except FileNotFoundError:
                pass

        if self.storage.is_local_root(path):
            return None
        self._load_dataset(self.storage.get_parent(path))
        return None


__all__ = ["OSEkitResolver"]
