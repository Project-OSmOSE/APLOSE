"""API GraphQL mutations annotations"""
import graphene

from .annotation_campaign import AnnotationCampaignMutation


class APIAnnotationMutation(
    AnnotationCampaignMutation,
    graphene.ObjectType,
):  # pylint: disable=too-few-public-methods
    """API GraphQL mutations"""
