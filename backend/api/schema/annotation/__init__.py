"""Annotation schema"""
from graphene import ObjectType

from .annotation import (
    AnnotationMutation as _AnnotationMutation,
    AnnotationQuery as _AnnotationQuery,
)
from .annotation_campaign import AnnotationCampaignMutation, AnnotationCampaignQuery
from .annotation_file_range import AnnotationFileRangeQuery
from .annotation_phase import AnnotationPhaseQuery, AnnotationPhaseMutation
from .annotation_spectrogram import AnnotationSpectrogramQuery
from .annotation_task import AnnotationTaskQuery
from .confidence_set import ConfidenceSetQuery
from .detector import DetectorQuery
from .label import LabelQuery
from .label_set import LabelSetQuery


class AnnotationQuery(
    _AnnotationQuery,
    AnnotationCampaignQuery,
    AnnotationFileRangeQuery,
    AnnotationPhaseQuery,
    AnnotationSpectrogramQuery,
    AnnotationTaskQuery,
    ConfidenceSetQuery,
    DetectorQuery,
    LabelQuery,
    LabelSetQuery,
    ObjectType,
):  # pylint: disable=too-few-public-methods
    """Annotation queries"""


class AnnotationMutation(
    _AnnotationMutation,
    AnnotationCampaignMutation,
    AnnotationPhaseMutation,
    ObjectType,
):  # pylint: disable=too-few-public-methods
    """Annotation mutations"""
