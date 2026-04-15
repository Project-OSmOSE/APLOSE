"""OSEkit resolver"""
from pathlib import PureWindowsPath, Path

from metadatax.data.models import FileFormat
from osekit import setup_logging
from osekit.core.spectro_dataset import SpectroDataset
from osekit.public.project import Project

from backend.api.models import (
    SpectrogramAnalysis,
    Dataset,
    Colormap,
    FFT,
    Spectrogram,
    SpectrogramAnalysisRelation,
)
from backend.storage.types import (
    FailedItem,
)
from backend.storage.utils import (
    exists,
    join,
    make_path_relative,
    make_absolute_server,
)
from ._legacy_osekit import LegacyOSEkitResolver

setup_logging()


class OSEkitResolver(LegacyOSEkitResolver):

    # Utils

    @staticmethod
    def _get_osekit_project(path: str) -> Project | None:
        json_path = join(path, "project.json")
        if exists(json_path):
            return Project.from_json(Path(make_absolute_server(json_path)))
        return None

    # Implements

    def _get_dataset_for_path(
        self, path: str | None = None
    ) -> Dataset | FailedItem | None:
        # pylint: disable=broad-exception-caught
        try:
            project = self._get_osekit_project(path)
            if not project:
                return super()._get_dataset_for_path(path=path)
            return Dataset(
                name=PureWindowsPath(path).name,
                path=make_path_relative(path),
            )
        except Exception as e:
            return FailedItem(path=path, error=e)

    def _get_all_analysis_for_dataset(
        self, dataset: Dataset, detailed: bool = False
    ) -> list[SpectrogramAnalysis]:
        osekit_project = self._get_osekit_project(dataset.path)
        if not osekit_project:
            return super()._get_all_analysis_for_dataset(dataset=dataset)

        analysis: list[SpectrogramAnalysis] = []
        for _name, info in osekit_project.outputs.items():
            if info["class"] != SpectroDataset.__name__:
                continue
            analysis.append(
                self._get_analysis(
                    dataset=dataset,
                    relative_path=make_path_relative(
                        PureWindowsPath(info["dataset"]).parent.as_posix(),
                        to=dataset.path,
                    ),
                    detailed=detailed,
                )
            )
        return analysis

    def _get_analysis(
        self, dataset: Dataset, relative_path: str, detailed: bool = False
    ) -> SpectrogramAnalysis | FailedItem | None:
        if dataset.legacy:
            return super()._get_analysis(
                dataset=dataset, relative_path=relative_path, detailed=detailed
            )
        osekit_dataset = self._get_osekit_project(dataset.path)
        spectro_dataset: SpectroDataset | None = None
        if not osekit_dataset:
            return None
        for _name, info in osekit_dataset.outputs.items():
            if info["class"] != SpectroDataset.__name__:
                continue
            path = make_path_relative(
                PureWindowsPath(info["dataset"]).parent.as_posix(),
                to=dataset.path,
            )
            if path == relative_path:
                if not detailed:
                    return SpectrogramAnalysis(
                        name=PureWindowsPath(relative_path).name,
                        path=relative_path,
                    )
                spectro_dataset = osekit_dataset.get_output(info["transform"])

        if spectro_dataset is None:
            return None

        if not detailed:
            return SpectrogramAnalysis(name=spectro_dataset.name, path=relative_path)
        return SpectrogramAnalysis(
            name=spectro_dataset.name,
            path=relative_path,
            start=spectro_dataset.begin,
            end=spectro_dataset.end,
            dataset=dataset,
            data_duration=spectro_dataset.data_duration.seconds,
            fft=FFT(
                nfft=spectro_dataset.fft.mfft,
                window_size=spectro_dataset.fft.win.size,
                overlap=1 - (spectro_dataset.fft.hop / spectro_dataset.fft.win.size),
                sampling_frequency=spectro_dataset.fft.fs,
                scaling=spectro_dataset.fft.scaling,
            ),
            colormap=Colormap(name=spectro_dataset.colormap or "viridis"),
            dynamic_min=spectro_dataset.v_lim[0],
            dynamic_max=spectro_dataset.v_lim[1],
        )

    @staticmethod
    def _get_spectro_dataset(analysis: SpectrogramAnalysis) -> SpectroDataset | None:
        json_path = join(analysis.dataset.path, "project.json")
        if not exists(json_path):
            return None
        osekit_dataset = Project.from_json(Path(make_absolute_server(json_path)))
        return osekit_dataset.get_output(analysis.name)

    def get_all_spectrograms_for_analysis(
        self, analysis: SpectrogramAnalysis
    ) -> list[Spectrogram]:
        sd = self._get_spectro_dataset(analysis=analysis)
        if not sd:
            return super().get_all_spectrograms_for_analysis(analysis=analysis)
        img_format, _ = FileFormat.objects.get_or_create(name="png")
        return [
            Spectrogram(
                format=img_format,
                filename=data.name,
                start=data.begin,
                end=data.end,
            )
            for data in sd.data
        ]

    def get_spectrogram_paths(
        self, relation: SpectrogramAnalysisRelation
    ) -> tuple[str | None, str | None]:
        """Get paths for spectrogram"""
        sd = self._get_spectro_dataset(analysis=relation.analysis)
        if not sd:
            return super().get_spectrogram_paths(relation=relation)

        for spectro_data in sd.data:
            if spectro_data.name == relation.spectrogram.filename:
                paths = relation.get_paths(
                    spectro_dataset=sd, spectro_data=spectro_data
                )
                return paths["audio"], paths["spectrogram"]

        return None, None
