from pathlib import Path

from django.conf import settings
from django.test import override_settings

from backend.storage.schema.resolver import (
    Folder,
    Dataset,
)
from .base_resolver import BaseResolverTestCase

VOLUMES_ROOT = settings.FIXTURE_DIRS[1] / "data" / "dataset" / "list_to_import"
LEGACY_GOOD = Path("legacy/good")


class FolderResolverTestCase(BaseResolverTestCase):

    resolver_class = Folder
    path = ""

    @override_settings(DATASET_EXPORT_PATH=LEGACY_GOOD, VOLUMES_ROOT=VOLUMES_ROOT)
    def test_node(self):
        resolver = self.resolver_class(settings.DATASET_EXPORT_PATH, self.path)
        self.assertIsNotNone(resolver.node)
        self.assertEqual("", resolver.node.path)
        self.assertEqual("", resolver.node.name)

    @override_settings(DATASET_EXPORT_PATH=LEGACY_GOOD, VOLUMES_ROOT=VOLUMES_ROOT)
    def test_browse(self):
        resolver = self.resolver_class(LEGACY_GOOD.as_posix(), self.path)
        content = resolver.browse()
        self.assertEqual(1, len(content))
        self.assertEqual(LEGACY_GOOD, content[0].root)
        self.assertEqual("gliderSPAmsDemo", content[0].path)
        self.assertIsInstance(content[0], Dataset)
        self.assertListEqual(
            [
                {
                    "path": "gliderSPAmsDemo",
                    "dataset": "gliderSPAmsDemo",
                    "spectro_duration": "600",
                    "dataset_sr": "480",
                    "file_type": ".wav",
                    "identifier": "",
                }
            ],
            content[0].legacy_datasets_in_csv,
        )
        self.assertListEqual(["gliderSPAmsDemo"], content[0].legacy_dataset_paths)
