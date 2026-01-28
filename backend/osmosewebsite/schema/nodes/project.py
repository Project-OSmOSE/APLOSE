"""Project graphql definitions"""
from django_extension.schema.types import ExtendedNode

from backend.osmosewebsite.models import Project


class WebsiteProjectNode(ExtendedNode):
    """Project node"""

    class Meta:
        model = Project
        fields = "__all__"
        filter_fields = ["id"]
