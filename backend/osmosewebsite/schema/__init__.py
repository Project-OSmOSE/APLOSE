"""GraphQL Schema for OSmOSE Website"""
import graphene
from graphene import Field
from graphene_django_pagination import DjangoPaginationConnectionField

from backend.osmosewebsite.models import Project as WebsiteProject
from .project import WebsiteProjectNode
from ...utils.schema import PK


class OSmOSEWebsiteQuery(graphene.ObjectType):
    """OSmOSE Website query"""

    # pylint: disable=too-few-public-methods

    all_website_projects = DjangoPaginationConnectionField(WebsiteProjectNode)
    website_projet_by_id = Field(WebsiteProjectNode, pk=PK(required=True))

    def resolve_website_projet_by_id(
        self, info, pk: int
    ):  # pylint: disable=unused-argument
        """Return website project by id"""
        return WebsiteProject.objects.get(pk=pk)
