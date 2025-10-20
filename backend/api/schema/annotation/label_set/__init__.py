import graphene

from backend.utils.schema import AuthenticatedDjangoConnectionField
from .label_set_node import LabelSetNode


class LabelSetQuery(graphene.ObjectType):  # pylint: disable=too-few-public-methods
    """LabelSet queries"""

    all_label_sets = AuthenticatedDjangoConnectionField(LabelSetNode)
