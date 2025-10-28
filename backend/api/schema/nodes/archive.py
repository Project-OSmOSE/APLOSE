"""Archive schema"""

from backend.api.models import Archive
from backend.utils.schema.types import BaseObjectType, BaseNode


class ArchiveNode(BaseObjectType):
    """Archive schema"""

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = Archive
        fields = "__all__"
        filter_fields = "__all__"
        interfaces = (BaseNode,)
