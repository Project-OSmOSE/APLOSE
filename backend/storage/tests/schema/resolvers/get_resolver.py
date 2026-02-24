from pathlib import Path

from django.conf import settings
from django.test import TestCase
from django.test import override_settings

from backend.storage.schema.resolver import (
    Folder,
    Dataset,
    get_resolver,
)

VOLUMES_ROOT = settings.FIXTURE_DIRS[1] / "data" / "dataset" / "list_to_import"
LEGACY_GOOD = Path("legacy/good")


class GetResolverTestCase(TestCase):
    @override_settings(DATASET_EXPORT_PATH=LEGACY_GOOD, VOLUMES_ROOT=VOLUMES_ROOT)
    def test_folder(self):
        resolver = get_resolver(settings.DATASET_EXPORT_PATH, "")
        self.assertIsInstance(resolver, Folder)

    @override_settings(DATASET_EXPORT_PATH=LEGACY_GOOD, VOLUMES_ROOT=VOLUMES_ROOT)
    def test_dataset(self):
        resolver = get_resolver(settings.DATASET_EXPORT_PATH, "gliderSPAmsDemo")
        self.assertIsInstance(resolver, Dataset)
