import graphene


class AnnotationTaskStatus(graphene.Enum):
    """From AnnotationTask.Status"""

    Created = "C"
    Finished = "F"
