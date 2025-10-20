"""GraphQL Schema"""

import graphene
from django_filters import NumberFilter
from graphene import relay, Field
from graphene_django.debug import DjangoDebug
from graphene_django_pagination import DjangoPaginationConnectionField
from metadatax.acquisition.models import Deployment, Project, ChannelConfiguration
from metadatax.acquisition.schema import (
    ChannelConfigurationNode as MxChannelConfigurationNode,
    ChannelConfigurationFilter as MxChannelConfigurationFilter,
)
from metadatax.acquisition.schema.deployment import (
    DeploymentNode as MetadataxDeploymentNode,
    DeploymentFilter as MetadataxDeploymentFilter,
)
from metadatax.acquisition.schema.project import ProjectFilter
from metadatax.acquisition.schema.project import ProjectNode as MetadataxProjectNode
from metadatax.schema import Mutation as MetadataxMutation, Query as MetadataxQuery

from .api.schema import APIQuery, APIMutation
from .aplose.schema import AploseQuery, AploseMutation
from .osmosewebsite.schema import OSmOSEWebsiteQuery, WebsiteProjectNode
from .utils.schema.filters import IDFilter


class DeploymentFilter(MetadataxDeploymentFilter):
    """Override of Metadatax deployment filter"""

    project__website_project__id = NumberFilter()

    class Meta(MetadataxDeploymentFilter.Meta):
        """Override of Metadatax deployment filter"""

        # pylint: disable=missing-docstring


class DeploymentNode(MetadataxDeploymentNode):
    """Override of Metadatax deployment node"""

    class Meta:
        # pylint: disable=missing-docstring, too-few-public-methods
        model = Deployment
        fields = "__all__"
        filterset_class = DeploymentFilter
        interfaces = (relay.Node,)


class ProjectNodeOverride(MetadataxProjectNode):
    website_project = Field(WebsiteProjectNode)

    class Meta:  # pylint: disable=too-few-public-methods
        model = Project
        fields = "__all__"
        filterset_class = ProjectFilter
        interfaces = (relay.Node,)


class ChannelConfigurationFilterSet(MxChannelConfigurationFilter):

    dataset_id = IDFilter(field_name="datasets__id")

    class Meta(MxChannelConfigurationFilter.Meta):
        pass


class ChannelConfigurationNode(MxChannelConfigurationNode):
    class Meta:
        model = ChannelConfiguration
        fields = "__all__"
        filterset_class = ChannelConfigurationFilterSet
        interfaces = (relay.Node,)


class Query(
    APIQuery,
    AploseQuery,
    OSmOSEWebsiteQuery,
    MetadataxQuery,
    graphene.ObjectType,
):
    """Global query"""

    debug = graphene.Field(DjangoDebug, name="_debug")

    # pylint: disable=too-few-public-methods

    all_deployments = DjangoPaginationConnectionField(DeploymentNode)
    all_channel_configurations = DjangoPaginationConnectionField(
        ChannelConfigurationNode, filterset_class=ChannelConfigurationFilterSet
    )
    all_projects = DjangoPaginationConnectionField(ProjectNodeOverride)


class Mutation(
    APIMutation,
    AploseMutation,
    MetadataxMutation,
    graphene.ObjectType,
):  # pylint: disable=too-few-public-methods
    """Global mutation"""


schema = graphene.Schema(query=Query, mutation=Mutation)
