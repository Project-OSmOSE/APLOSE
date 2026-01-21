"""Archive schema"""
from django_extension.schema.types import ExtendedNode

from backend.api.models import Archive


class ArchiveNode(ExtendedNode):
    """Archive schema"""

    class Meta:
        model = Archive
        fields = "__all__"
        filter_fields = "__all__"
