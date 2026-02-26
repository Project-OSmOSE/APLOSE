import json
from os.path import join
from pathlib import PureWindowsPath, Path

import numpy as np
from pandas import Timestamp, Timedelta
from scipy.signal import ShortTimeFFT


class TFile:
    begin: Timestamp
    end: Timestamp
    path: str

    def __init__(self, d: dict, dataset_path):
        self.begin = d["begin"]
        self.end = d["end"]
        self.path = join(
            dataset_path,
            PureWindowsPath(d["path"])
            .as_posix()
            .split(PureWindowsPath(dataset_path).stem)
            .pop()
            .strip("/"),
        )


class AudioData:
    dataset_path: Path

    files: list[TFile]

    def __init__(self, d: dict, dataset_path):
        self.dataset_path = dataset_path
        self.audio_data = [TFile(d, dataset_path) for name, d in d["files"].items()]


class SpectroData:
    dataset_path: Path
    name: str
    v_lim: list[int]  # TODO
    begin: Timestamp
    end: Timestamp
    duration: Timedelta
    audio_data: AudioData

    def __init__(self, d: dict, name, dataset_path):
        self.dataset_path = dataset_path
        self.name = name
        self.begin = Timestamp(d["begin"])
        self.end = Timestamp(d["end"])
        self.v_lim = d["v_lim"]
        self.duration = self.end - self.begin
        self.audio_data = AudioData(d["audio_data"], dataset_path)


class SpectroDataset:
    folder: Path
    name: str
    data: list[SpectroData] = []

    def __init__(self, d: dict, path):
        self.d = d
        self.folder = path
        self.name = d["name"]

    @property
    def fft(self) -> ShortTimeFFT:
        sft = list(self.d["sft"].values())[0]
        return ShortTimeFFT(
            win=np.array(sft["win"]),
            hop=sft["hop"],
            fs=sft["fs"],
            mfft=sft["mfft"],
        )

    @property
    def colormap(self) -> str | None:
        return list(self.d["data"].values())[0]["colormap"]

    @property
    def begin(self) -> Timestamp:
        """Begin of the first data object."""
        return min(data.begin for data in self.data)

    @property
    def end(self) -> Timestamp:
        """End of the last data object."""
        return max(data.end for data in self.data)

    @property
    def data_duration(self) -> Timedelta:
        data_durations = [
            Timedelta(data.duration).round(freq="1s") for data in self.data
        ]
        return max(set(data_durations), key=data_durations.count)

    def load_data(self):
        self.data = [
            SpectroData(d, name, self.folder) for name, d in self.d["data"].items()
        ]

    @staticmethod
    def from_json(json_path: Path) -> "SpectroDataset":
        with json_path.open("r") as f:
            return SpectroDataset(
                json.loads(f.read()),
                PureWindowsPath(json_path).as_posix()[
                    : -len(f"/{json_path.stem}{json_path.suffix}")
                ],
            )


class OSEkitDataset:
    datasets: dict

    def __init__(self, d: dict, path):
        self.datasets = {}
        for name, dataset in d["datasets"].items():
            analysis_json_path = join(
                path,
                PureWindowsPath(dataset["json"])
                .as_posix()
                .split(PureWindowsPath(path).stem)
                .pop()
                .strip("/"),
            )
            self.datasets[name] = {
                "class": dataset["class"],
                "analysis": dataset["analysis"],
                "dataset": SpectroDataset.from_json(
                    Path(PureWindowsPath(analysis_json_path).as_posix())
                ),
            }

    @staticmethod
    def from_json(json_path: Path) -> "OSEkitDataset":
        with json_path.open("r") as f:
            return OSEkitDataset(
                json.loads(f.read()),
                PureWindowsPath(json_path).as_posix()[: -len("/dataset.json")],
            )
