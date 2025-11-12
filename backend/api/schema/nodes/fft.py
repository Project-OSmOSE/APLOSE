"""FFT schema"""

from backend.api.models import FFT
from backend.utils.schema.types import BaseObjectType, BaseNode


class FFTNode(BaseObjectType):
    """FFT schema"""

    class Meta:
        model = FFT
        fields = "__all__"
        filter_fields = {}
        interfaces = (BaseNode,)
