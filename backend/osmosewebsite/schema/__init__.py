"""GraphQL Schema for OSmOSE Website"""
import graphene
from django_extension.schema.fields import ByIdField
from graphene_django_pagination import DjangoPaginationConnectionField

from .nodes import (
    WebsiteProjectNode,
    TeamMemberNode,
    NewsNode,
    CollaboratorNode,
    ScientificTalkNode,
)


class OSmOSEWebsiteQuery(graphene.ObjectType):
    """OSmOSE Website query"""

    all_collaborators = DjangoPaginationConnectionField(CollaboratorNode)

    all_website_projects = DjangoPaginationConnectionField(WebsiteProjectNode)
    website_project_by_id = ByIdField(WebsiteProjectNode)

    all_team_members = DjangoPaginationConnectionField(TeamMemberNode)
    team_member_by_id = ByIdField(TeamMemberNode)

    all_news = DjangoPaginationConnectionField(NewsNode)
    news_by_id = ByIdField(NewsNode)

    all_scientific_talks = DjangoPaginationConnectionField(ScientificTalkNode)
