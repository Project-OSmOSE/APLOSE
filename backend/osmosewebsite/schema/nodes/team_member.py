from django_extension.schema.types import ExtendedNode, ExtendedEnumType

from backend.osmosewebsite.models import TeamMember


class TeamMemberTypeEnum(ExtendedEnumType):
    class Meta:
        enum = TeamMember.Type

    Active = "A"
    Former = "F"
    Collaborator = "C"


class TeamMemberNode(ExtendedNode):
    """TeamMember node"""

    type = TeamMemberTypeEnum()

    class Meta:
        model = TeamMember
        fields = "__all__"
        filter_fields = ["id"]
