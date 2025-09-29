"""API GraphQL mutations annotations"""
import graphene

from .annotation_campaign import AnnotationCampaignMutation
from .annotation_phase import AnnotationPhaseMutation


class APIAnnotationMutation(
    AnnotationCampaignMutation,
    AnnotationPhaseMutation,
    graphene.ObjectType,
):  # pylint: disable=too-few-public-methods
    """API GraphQL mutations"""
