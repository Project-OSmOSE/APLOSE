"""Annotation related schema"""
import graphene

from backend.utils.schema import AuthenticatedDjangoConnectionField
from .acoustic_features import AcousticFeaturesNode
from .annotation import AnnotationNode
from .annotation_campaign import AnnotationCampaignNode, AnnotationCampaignQuery
from .annotation_comment import AnnotationCommentNode
from .annotation_file_range import AnnotationFileRangeQuery
from .annotation_phase import (
    AnnotationPhaseNode,
    AnnotationPhaseType,
    AnnotationPhaseQuery,
)
from .annotation_task import AnnotationTaskQuery
from .annotation_validation import AnnotationValidationNode
from .confidence import ConfidenceNode
from .confidence_set import ConfidenceSetNode, ConfidenceSetQuery
from .detector import DetectorNode
from .detector_configuration import DetectorConfigurationNode
from .label import AnnotationLabelNode
from .label_set import LabelSetNode, LabelSetQuery


class APIAnnotationQuery(
    AnnotationCampaignQuery,
    AnnotationPhaseQuery,
    AnnotationTaskQuery,
    AnnotationFileRangeQuery,
    ConfidenceSetQuery,
    LabelSetQuery,
    graphene.ObjectType,
):  # pylint: disable=too-few-public-methods
    """API GraphQL queries"""

    all_acoustic_features = AuthenticatedDjangoConnectionField(AcousticFeaturesNode)
    all_annotations = AuthenticatedDjangoConnectionField(AnnotationNode)
    all_annotation_comments = AuthenticatedDjangoConnectionField(AnnotationCommentNode)

    all_annotation_validations = AuthenticatedDjangoConnectionField(
        AnnotationValidationNode
    )
    all_confidences = AuthenticatedDjangoConnectionField(ConfidenceNode)
    all_detectors = AuthenticatedDjangoConnectionField(DetectorNode)
    all_detector_configurations = AuthenticatedDjangoConnectionField(
        DetectorConfigurationNode
    )
    all_annotation_labels = AuthenticatedDjangoConnectionField(AnnotationLabelNode)
