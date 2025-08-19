"""AnnotationPhase schema"""
from graphene import relay, Scalar
from graphql.language import ast

from backend.api.models import AnnotationPhase
from backend.utils.schema import ApiObjectType


class PhaseTypeEnum(Scalar):
    # pylint: disable=missing-class-docstring

    @staticmethod
    def serialize(value):
        """Serialize enum"""
        return AnnotationPhase.Type(value).label

    @staticmethod
    def parse_literal(node, _variables=None):
        """Parse literal"""
        if isinstance(node, ast.StringValueNode):
            index = AnnotationPhase.Type.labels.index(node.value)
            value = AnnotationPhase.Type.values[index]
            return AnnotationPhase.Type(value)
        return None

    @staticmethod
    def parse_value(value):
        """Parse value"""
        index = AnnotationPhase.Type.labels.index(value)
        value = AnnotationPhase.Type.values[index]
        return AnnotationPhase.Type(value)


class AnnotationPhaseNode(ApiObjectType):
    """AnnotationPhase schema"""

    phase = PhaseTypeEnum()

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AnnotationPhase
        fields = "__all__"
        filter_fields = "__all__"
        interfaces = (relay.Node,)
