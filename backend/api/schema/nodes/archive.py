"""Archive schema"""

from backend.api.models import Archive
from backend.utils.schema.types import BaseObjectType, BaseNode


class ArchiveNode(BaseObjectType):
    """Archive schema"""

    class Meta:
        model = Archive
        fields = "__all__"
        filter_fields = "__all__"
        interfaces = (BaseNode,)
