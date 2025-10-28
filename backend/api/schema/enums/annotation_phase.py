import graphene


class AnnotationPhaseType(graphene.Enum):
    """From AnnotationPhase.Type"""

    Annotation = "A"
    Verification = "V"
