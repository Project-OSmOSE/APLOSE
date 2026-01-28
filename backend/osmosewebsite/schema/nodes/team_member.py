from django_extension.schema.types import ExtendedNode

from backend.osmosewebsite.models import TeamMember


class TeamMemberNode(ExtendedNode):
    """TeamMember node"""

    class Meta:
        model = TeamMember
        fields = "__all__"
        filter_fields = ["id"]
