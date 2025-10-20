import graphene

from backend.utils.schema import AuthenticatedDjangoConnectionField
from .file_range_node import AnnotationFileRangeNode


class AnnotationFileRangeQuery(
    graphene.ObjectType
):  # pylint: disable=too-few-public-methods
    """AnnotationFileRange queries"""

    all_annotation_file_ranges = AuthenticatedDjangoConnectionField(
        AnnotationFileRangeNode
    )
