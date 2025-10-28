import graphene


class AnnotationType(graphene.Enum):
    """From Annotation.Type"""

    Weak = "W"
    Point = "P"
    Box = "B"
