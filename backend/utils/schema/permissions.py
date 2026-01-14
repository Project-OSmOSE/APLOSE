"""GraphQL Permissions"""
import logging
import traceback
from enum import Enum

from graphql import GraphQLResolveInfo, GraphQLError
from typing_extensions import Optional

from backend.aplose.models import User
from .errors import UnauthorizedError, ForbiddenError

logger = logging.getLogger(__name__)


class GraphQLPermissions(Enum):
    """GraphQL access permission"""

    AUTHENTICATED = 1
    STAFF_OR_SUPERUSER = 2
    SUPERUSER = 3


class GraphQLResolve:
    """GraphQL resolver - handles permissions"""

    def __init__(self, permission: GraphQLPermissions):
        self.permission = permission

    def __call__(self, fn, *args, **kwargs):
        def wrapper(*args, **kwargs):
            info: Optional[GraphQLResolveInfo] = None
            if "info" in kwargs:
                info = kwargs["info"]
            else:
                for arg in args:
                    if isinstance(arg, GraphQLResolveInfo):
                        info = arg

            self.check_permission(info.context.user if info else None)

            try:
                return fn(*args, **kwargs)
            except Exception as e:

                if isinstance(e, GraphQLError):
                    raise e

                # Capture the full traceback in your console
                logger.error(traceback.format_exc())

                # return error to client
                raise e

        return wrapper

    def check_permission(self, user: Optional[User]):
        """Check user responds to the given permission"""
        if self.permission in [
            GraphQLPermissions.AUTHENTICATED,
            GraphQLPermissions.STAFF_OR_SUPERUSER,
            GraphQLPermissions.SUPERUSER,
        ]:
            if user is None or not user.is_authenticated:
                raise UnauthorizedError()

        if self.permission == GraphQLPermissions.STAFF_OR_SUPERUSER:
            if not (user.is_staff or user.is_superuser):
                raise ForbiddenError()
        if self.permission == GraphQLPermissions.SUPERUSER:
            if not user.is_superuser:
                raise ForbiddenError()
