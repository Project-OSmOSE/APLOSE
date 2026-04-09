from typing import TypedDict


class ImportAnalysisInfo(TypedDict):

    # Identification
    dataset_id: int
    analysis_path: str

    # Progress
    analysis_id: int | None
    total_spectrograms: int | None
    completed_spectrograms: int
    chunk_size: int


__all__ = ["ImportAnalysisInfo"]
