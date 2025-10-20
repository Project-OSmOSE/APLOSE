import graphene

from backend.utils.schema import AuthenticatedDjangoConnectionField
from .confidence_set_node import ConfidenceSetNode


class ConfidenceSetQuery(graphene.ObjectType):  # pylint: disable=too-few-public-methods
    """ConfidenceSet queries"""

    all_confidence_sets = AuthenticatedDjangoConnectionField(ConfidenceSetNode)
