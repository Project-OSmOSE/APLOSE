"""GraphQL Schema"""

import graphene
from django.contrib.contenttypes.models import ContentType
from django_extension.filters import IDFilter
from django_extension.schema.types import ExtendedNode
from django_filters import NumberFilter, FilterSet
from graphene import relay, Field
from graphene_django.debug import DjangoDebug
from graphene_django_pagination import DjangoPaginationConnectionField
from metadatax.acquisition.models import Deployment, Project, ChannelConfiguration
from metadatax.acquisition.schema import (
    DeploymentNode as MxDeploymentNode,
    ProjectNode as MxProjectNode,
    ChannelConfigurationNode as MxChannelConfigurationNode,
)
from metadatax.schema import Mutation as MetadataxMutation, Query as MetadataxQuery

from .api.schema import APIQuery, APIMutation
from .aplose.schema import AploseQuery, AploseMutation
from .osmosewebsite.schema import OSmOSEWebsiteQuery, WebsiteProjectNode
from .storage.schema import StorageQuery, StorageMutation


class DeploymentFilter(FilterSet):
    """Override of Metadatax deployment filter"""

    project__website_project__id = NumberFilter()

    class Meta:
        model = Deployment
        fields = {
            "id": ["exact", "in"],
            "project_id": ["exact", "in"],
            "site_id": ["exact", "in"],
            "campaign_id": ["exact", "in"],
            "platform_id": ["exact", "in"],
            "longitude": ["exact", "lt", "lte", "gt", "gte"],
            "latitude": ["exact", "lt", "lte", "gt", "gte"],
            "name": ["exact", "icontains"],
            "bathymetric_depth": ["exact", "lt", "lte", "gt", "gte"],
            "deployment_date": ["exact", "lt", "lte", "gt", "gte"],
            "deployment_vessel": ["exact", "icontains"],
            "recovery_date": ["exact", "lt", "lte", "gt", "gte"],
            "recovery_vessel": ["exact", "icontains"],
            "description": ["icontains"],
        }


class DeploymentNode(MxDeploymentNode):
    """Override of Metadatax deployment node"""

    class Meta:
        model = Deployment
        fields = "__all__"
        filterset_class = DeploymentFilter
        interfaces = (relay.Node,)


class ProjectNodeOverride(MxProjectNode):
    website_project = Field(WebsiteProjectNode)

    class Meta:
        model = Project
        fields = "__all__"
        filter_fields = {
            "id": ["exact", "in"],
            "name": ["exact", "icontains"],
            "accessibility": ["exact"],
            "doi": ["exact"],
            "start_date": ["exact", "lte", "lt", "gte", "gt"],
            "end_date": ["exact", "lte", "lt", "gte", "gt"],
            "project_goal": ["exact", "icontains"],
            "financing": ["exact"],
        }


class ChannelConfigurationFilterSet(FilterSet):

    dataset_id = IDFilter(field_name="datasets__id")

    class Meta:
        model = ChannelConfiguration
        fields = {
            "id": ["exact", "in"],
            "recorder_specification": ["isnull"],
            "detector_specification": ["isnull"],
            "continuous": ["exact"],
            "duty_cycle_on": ["exact", "lt", "lte", "gt", "gte"],
            "duty_cycle_off": ["exact", "lt", "lte", "gt", "gte"],
            "instrument_depth": ["exact", "lt", "lte", "gt", "gte"],
            "timezone": ["exact"],
            "record_start_date": ["exact", "lt", "lte", "gt", "gte"],
            "record_end_date": ["exact", "lt", "lte", "gt", "gte"],
        }


class ChannelConfigurationNode(MxChannelConfigurationNode):
    class Meta:
        model = ChannelConfiguration
        fields = "__all__"
        filterset_class = ChannelConfigurationFilterSet


class ContentTypeNode(ExtendedNode):
    class Meta:
        model = ContentType
        fields = "__all__"
        filter_fields = {
            "id": ("exact",),
            "app_label": ("exact",),
            "model": ("in",),
        }
        interfaces = (relay.Node,)


class Query(
    StorageQuery,
    APIQuery,
    AploseQuery,
    OSmOSEWebsiteQuery,
    MetadataxQuery,
    graphene.ObjectType,
):
    """Global query"""

    debug = graphene.Field(DjangoDebug, name="_debug")

    content_types = DjangoPaginationConnectionField(ContentTypeNode)

    all_deployments = DjangoPaginationConnectionField(DeploymentNode)
    all_channel_configurations = DjangoPaginationConnectionField(
        ChannelConfigurationNode, filterset_class=ChannelConfigurationFilterSet
    )
    all_projects = DjangoPaginationConnectionField(ProjectNodeOverride)


class Mutation(
    StorageMutation,
    APIMutation,
    AploseMutation,
    MetadataxMutation,
    graphene.ObjectType,
):
    """Global mutation"""

    debug = graphene.Field(DjangoDebug, name="_debug")


schema = graphene.Schema(query=Query, mutation=Mutation)
