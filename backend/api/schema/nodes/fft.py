"""FFT schema"""
from django_extension.schema.types import ExtendedNode

from backend.api.models import FFT


class FFTNode(ExtendedNode):
    """FFT schema"""

    class Meta:
        model = FFT
        fields = "__all__"
        filter_fields = {}
