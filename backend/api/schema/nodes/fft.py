"""FFT schema"""

from backend.api.models import FFT
from backend.utils.schema.types import BaseObjectType, BaseNode


class FFTNode(BaseObjectType):
    """FFT schema"""

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = FFT
        fields = "__all__"
        filter_fields = {}
        interfaces = (BaseNode,)
