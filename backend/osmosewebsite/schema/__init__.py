"""GraphQL Schema for OSmOSE Website"""
import graphene
from django_extension.schema.fields import ByIdField
from graphene_django_pagination import DjangoPaginationConnectionField

from .project import WebsiteProjectNode


class OSmOSEWebsiteQuery(graphene.ObjectType):
    """OSmOSE Website query"""

    all_website_projects = DjangoPaginationConnectionField(WebsiteProjectNode)
    website_projet_by_id = ByIdField(WebsiteProjectNode)
