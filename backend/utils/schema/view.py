"""GraphQL view"""
import logging

from graphene_django.views import GraphQLView
from rest_framework import permissions
from rest_framework.decorators import (
    permission_classes,
    authentication_classes,
    api_view,
)
from rest_framework.request import Request
from rest_framework.settings import api_settings

logger = logging.getLogger(__name__)


class DRFAuthenticatedGraphQLView(GraphQLView):
    """Allow GraphQL to handle REST authenticated users"""

    def parse_body(self, request):
        if isinstance(request, Request):
            return request.data
        return super().parse_body(request)

    @classmethod
    def as_view(cls, *args, **kwargs):
        view = super().as_view(*args, **kwargs)
        view = permission_classes((permissions.AllowAny,))(view)
        view = authentication_classes(api_settings.DEFAULT_AUTHENTICATION_CLASSES)(view)
        view = api_view(["GET", "POST"])(view)
        return view
