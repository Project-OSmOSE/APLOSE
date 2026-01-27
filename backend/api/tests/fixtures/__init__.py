"""Fixtures util consts"""
DATA_FIXTURES = [
    "colormap",
    "dataset",
    "fft",
    "legacy_spectrogram_configuration",
    "spectrogram",
    "spectrogram_analysis",
]

COMMON_FIXTURES = ["archive", "session"]

ANNOTATION_FIXTURES = [
    "acoustic_features",
    "annotation",
    "annotation_comment",
    "annotation_campaign",
    "annotation_file_range",
    "annotation_phase",
    "annotation_task",
    "annotation_validation",
    "confidence",
    "confidence_set",
    "detector",
    "detector_configuration",
    "label",
    "label_set",
]

ALL_FIXTURES = [
    "users",
    *DATA_FIXTURES,
    *COMMON_FIXTURES,
    *ANNOTATION_FIXTURES,
]
