import graphene

from backend.utils.schema import AuthenticatedDjangoConnectionField
from .label_node import AnnotationLabelNode


class LabelQuery(graphene.ObjectType):  # pylint: disable=too-few-public-methods
    """Label queries"""

    all_annotation_labels = AuthenticatedDjangoConnectionField(AnnotationLabelNode)
