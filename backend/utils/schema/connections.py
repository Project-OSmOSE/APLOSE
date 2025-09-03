"""GraphQL Connections"""
from graphene_django_pagination import DjangoPaginationConnectionField

from .errors import UnauthorizedError


class AuthenticatedDjangoConnectionField(DjangoPaginationConnectionField):
    """Extended DjangoPaginationConnectionField - Only allow authenticated queries"""

    # pylint: disable=too-many-positional-arguments, too-many-arguments
    @classmethod
    def resolve_queryset(
        cls, connection, iterable, info, args, filtering_args, filterset_class
    ):
        if not info.context.user.is_authenticated:
            raise UnauthorizedError()

        return super().resolve_queryset(
            connection, iterable, info, args, filtering_args, filterset_class
        )
