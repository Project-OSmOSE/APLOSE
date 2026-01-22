"""FFT schema"""

import graphene
from backend.api.models import FFT
from backend.utils.schema.types import BaseObjectType, BaseNode


class FFTNode(BaseObjectType):
    """FFT schema"""

    overlap = graphene.Float()  # Override to convert Decimal to Float

    class Meta:
        model = FFT
        fields = "__all__"
        filter_fields = {}
        interfaces = (BaseNode,)

    def resolve_overlap(self, info):
        """Convert Decimal overlap to float for GraphQL"""
        if self.overlap is not None:
            return float(self.overlap)
        return None
