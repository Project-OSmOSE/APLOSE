"""Project graphql definitions"""
from graphene import relay

from backend.osmosewebsite.models import Project
from backend.utils.schema import ApiObjectType


class WebsiteProjectNode(ApiObjectType):
    """Project node"""

    class Meta:
        model = Project
        fields = "__all__"
        filter_fields = ["id"]
        interfaces = (relay.Node,)

    # Important!
    @classmethod
    def get_queryset(cls, queryset, info):
        print("get_queryset", queryset, info)
        return queryset
