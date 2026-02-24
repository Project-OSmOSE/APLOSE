from enum import Enum
from typing import TypedDict

LegacyCSVDataset = TypedDict(
    "LegacyCSVDataset",
    {
        "dataset": str,
        "path": str,
        "spectro_duration": str,
        "dataset_sr": str,
    },
)
ImportStatus = Enum(
    "Status",
    [
        ("Unavailable", -1),
        ("Available", 0),
        ("Partial", 1),
        ("Imported", 2),
    ],
)


__all__ = ["LegacyCSVDataset", "ImportStatus"]
