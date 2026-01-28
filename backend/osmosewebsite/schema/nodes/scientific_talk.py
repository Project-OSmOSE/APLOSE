from django_extension.schema.types import ExtendedNode

from backend.osmosewebsite.models import ScientificTalk


class ScientificTalkNode(ExtendedNode):
    """ScientificTalk node"""

    class Meta:
        model = ScientificTalk
        fields = "__all__"
        filter_fields = ["id"]
