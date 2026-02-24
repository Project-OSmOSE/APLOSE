from pathlib import Path, PureWindowsPath

from django.conf import settings
from django.test import override_settings

from backend.storage.schema.resolver import (
    Dataset,
    ImportStatus,
    Analysis,
)
from .base_resolver import BaseResolverTestCase

VOLUMES_ROOT = settings.FIXTURE_DIRS[1] / "data" / "dataset" / "list_to_import"
LEGACY_GOOD = Path("legacy/good")
GOOD = Path("good")


class DatasetResolverTestCase(BaseResolverTestCase):

    resolver_class = Dataset
    path = "tp_osekit"
    legacy_path = "gliderSPAmsDemo"

    def test_resolve_legacy_missing_csv(self):
        pass

    def test_resolve_legacy_csv_missing_column(self):
        pass

    @override_settings(DATASET_EXPORT_PATH=GOOD, VOLUMES_ROOT=VOLUMES_ROOT)
    def test_resolve(self):
        resolver = self.resolver_class(settings.DATASET_EXPORT_PATH, self.path)

        self.assertEqual(PureWindowsPath(settings.DATASET_EXPORT_PATH), resolver.root)
        self.assertEqual("tp_osekit", resolver.path)
        self.assertEqual("tp_osekit", resolver.name)
        self.assertListEqual([], resolver.legacy_datasets_in_csv)
        self.assertListEqual([], resolver.legacy_dataset_paths)

    @override_settings(DATASET_EXPORT_PATH=GOOD, VOLUMES_ROOT=VOLUMES_ROOT)
    def test_browse(self):
        resolver = self.resolver_class(settings.DATASET_EXPORT_PATH, self.path)
        content = resolver.browse()
        self.assertEqual(1, len(content))
        self.__check_analysis(content[0])

    @override_settings(DATASET_EXPORT_PATH=GOOD, VOLUMES_ROOT=VOLUMES_ROOT)
    def test_get_analysis(self):
        resolver = self.resolver_class(settings.DATASET_EXPORT_PATH, self.path)
        analysis = resolver.get_analysis("my_first_analysis")
        self.__check_analysis(analysis)

    def __check_analysis(self, analysis):
        self.assertIsNotNone(analysis)
        self.assertEqual(PureWindowsPath(settings.DATASET_EXPORT_PATH), analysis.root)
        self.assertEqual("tp_osekit/processed/my_first_analysis", analysis.path)
        self.assertIsInstance(analysis, Analysis)
        self.assertListEqual([], analysis.legacy_datasets_in_csv)
        self.assertListEqual([], analysis.legacy_dataset_paths)

    @override_settings(DATASET_EXPORT_PATH=LEGACY_GOOD, VOLUMES_ROOT=VOLUMES_ROOT)
    def test_resolve_legacy(self):
        resolver = self.resolver_class(settings.DATASET_EXPORT_PATH, self.legacy_path)

        self.assertEqual(PureWindowsPath(settings.DATASET_EXPORT_PATH), resolver.root)
        self.assertEqual("gliderSPAmsDemo", resolver.path)
        self.assertEqual("gliderSPAmsDemo", resolver.name)

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
    def test_browse_legacy(self):
        resolver = self.resolver_class(LEGACY_GOOD.as_posix(), self.legacy_path)
        content = resolver.browse()
        self.assertEqual(1, len(content))
        self.__check_analysis_legacy(content[0])

    @override_settings(DATASET_EXPORT_PATH=LEGACY_GOOD, VOLUMES_ROOT=VOLUMES_ROOT)
    def test_get_analysis_legacy(self):
        resolver = self.resolver_class(LEGACY_GOOD.as_posix(), self.legacy_path)
        analysis = resolver.get_analysis("4096_512_85")
        self.__check_analysis_legacy(analysis)

    def __check_analysis_legacy(self, analysis):
        self.assertIsNotNone(analysis)
        self.assertEqual(PureWindowsPath(settings.DATASET_EXPORT_PATH), analysis.root)
        self.assertEqual(
            "gliderSPAmsDemo/processed/spectrogram/600_480/4096_512_85", analysis.path
        )
        self.assertIsInstance(analysis, Analysis)
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
            analysis.legacy_datasets_in_csv,
        )
        self.assertListEqual(["gliderSPAmsDemo"], analysis.legacy_dataset_paths)

    @override_settings(DATASET_EXPORT_PATH=GOOD, VOLUMES_ROOT=VOLUMES_ROOT)
    def test_node(self):
        resolver = self.resolver_class(settings.DATASET_EXPORT_PATH, self.path)
        self.assertIsNotNone(resolver.node)
        self.assertEqual("tp_osekit", resolver.node.path)
        self.assertEqual("tp_osekit", resolver.node.name)
        self.assertEqual(ImportStatus.Available, resolver.node.import_status)
