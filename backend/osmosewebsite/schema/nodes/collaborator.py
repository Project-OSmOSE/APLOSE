"""Collaborator graphql definitions"""
from django_extension.schema.types import ExtendedNode

from backend.osmosewebsite.models import Collaborator


class CollaboratorNode(ExtendedNode):
    """Collaborator node"""

    class Meta:
        model = Collaborator
        fields = "__all__"
        filter_fields = [
            "id",
            "show_on_home_page",
            "show_on_aplose_home",
        ]
