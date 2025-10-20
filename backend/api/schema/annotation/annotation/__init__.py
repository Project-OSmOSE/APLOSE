import graphene

from backend.utils.schema import AuthenticatedDjangoConnectionField
from .annotation_node import AnnotationNode


# from .mutation import AnnotationMutation as _AnnotationMutation
# from .update_list_mutation import UpdateAnnotationListMutation


class AnnotationQuery(graphene.ObjectType):  # pylint: disable=too-few-public-methods
    """Annotation queries"""

    all_annotations = AuthenticatedDjangoConnectionField(AnnotationNode)


class AnnotationMutation(graphene.ObjectType):  # pylint: disable=too-few-public-methods
    """Annotation mutations"""

    # update_annotations = UpdateAnnotationListMutation.Field()
    # update_annotation = _AnnotationMutation.Field()
