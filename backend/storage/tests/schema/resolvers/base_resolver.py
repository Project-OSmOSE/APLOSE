from pathlib import Path, PureWindowsPath

from django.conf import settings
from django.test import TestCase
from django.test import override_settings

from backend.storage.schema.resolver import FileFolderException, InexistentPathException
from backend.storage.schema.resolver.base_resolver import BaseResolver

VOLUMES_ROOT = settings.FIXTURE_DIRS[1] / "data" / "dataset" / "list_to_import"
LEGACY_GOOD = Path("legacy/good")
LEGACY_MISSING_CSV = Path("legacy/missing_file")
LEGACY_CSV_MISSING_COLUMN = Path("legacy/missing_csv_columns")


class BaseResolverTestCase(TestCase):
    resolver_class = BaseResolver
    path = ""

    @override_settings(DATASET_EXPORT_PATH=LEGACY_GOOD, VOLUMES_ROOT=VOLUMES_ROOT)
    def test_resolve_unknown(self):
        self.assertRaises(
            InexistentPathException,
            lambda: self.resolver_class(settings.DATASET_EXPORT_PATH, "datasets"),
        )

    @override_settings(DATASET_EXPORT_PATH=LEGACY_GOOD, VOLUMES_ROOT=VOLUMES_ROOT)
    def test_resolve_file_fails(self):
        self.assertRaises(
            FileFolderException,
            lambda: self.resolver_class(settings.DATASET_EXPORT_PATH, "datasets.csv"),
        )

    @override_settings(
        DATASET_EXPORT_PATH=LEGACY_MISSING_CSV, VOLUMES_ROOT=VOLUMES_ROOT
    )
    def test_resolve_legacy_missing_csv(self):
        resolver = self.resolver_class(settings.DATASET_EXPORT_PATH, self.path)
        self.assertListEqual([], resolver.legacy_datasets_in_csv)
        self.assertListEqual([], resolver.legacy_dataset_paths)

    @override_settings(
        DATASET_EXPORT_PATH=LEGACY_CSV_MISSING_COLUMN, VOLUMES_ROOT=VOLUMES_ROOT
    )
    def test_resolve_legacy_csv_missing_column(self):
        resolver = self.resolver_class(settings.DATASET_EXPORT_PATH, self.path)
        self.assertListEqual([], resolver.legacy_datasets_in_csv)
        self.assertListEqual([], resolver.legacy_dataset_paths)

    @override_settings(DATASET_EXPORT_PATH=LEGACY_GOOD, VOLUMES_ROOT=VOLUMES_ROOT)
    def test_resolve(self):
        resolver = self.resolver_class(settings.DATASET_EXPORT_PATH, self.path)

        self.assertEqual(settings.DATASET_EXPORT_PATH, resolver.root)
        self.assertEqual("", resolver.path)
        self.assertEqual("", resolver.name)

        self.assertEqual(
            PureWindowsPath(str(VOLUMES_ROOT / settings.DATASET_EXPORT_PATH)),
            resolver._path_to_server(),
        )
        self.assertEqual(
            PureWindowsPath(
                str(VOLUMES_ROOT / settings.DATASET_EXPORT_PATH / "gliderSPAmsDemo")
            ),
            resolver._path_to_server("gliderSPAmsDemo"),
        )

        self.assertEqual("a/b", resolver._join("a", "b"))

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
            resolver.legacy_datasets_in_csv,
        )
        self.assertListEqual(["gliderSPAmsDemo"], resolver.legacy_dataset_paths)

    @override_settings(DATASET_EXPORT_PATH=LEGACY_GOOD, VOLUMES_ROOT=VOLUMES_ROOT)
    def test_node(self):
        resolver = self.resolver_class(settings.DATASET_EXPORT_PATH, self.path)
        self.assertIsNone(resolver.node)

    @override_settings(DATASET_EXPORT_PATH=LEGACY_GOOD, VOLUMES_ROOT=VOLUMES_ROOT)
    def test_browse(self, path=None):
        resolver = self.resolver_class(settings.DATASET_EXPORT_PATH, self.path)
        self.assertListEqual([], resolver.browse())
