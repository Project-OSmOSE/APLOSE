"""AnnotationValidation schema"""
from django_filters.rest_framework import FilterSet
from graphene import relay

from backend.api.models import AnnotationValidation
from backend.utils.schema import ApiObjectType, PKFilter


class AnnotationValidationFilters(FilterSet):
    """AnnotationValidation filters"""

    annotator_id = PKFilter()

    class Meta:
        model = AnnotationValidation
        fields = {}


class AnnotationValidationNode(ApiObjectType):
    """AnnotationValidation schema"""

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = AnnotationValidation
        fields = "__all__"
        filterset_class = AnnotationValidationFilters
        interfaces = (relay.Node,)
