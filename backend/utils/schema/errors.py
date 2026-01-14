"""GraphQL Errors"""
from graphql import GraphQLError
from rest_framework import status
from rest_framework.exceptions import APIException


class UnauthorizedError(GraphQLError):
    """Unauthorized error"""

    def __init__(self):
        super().__init__(
            "Unauthorized",
            original_error=APIException(code=status.HTTP_401_UNAUTHORIZED),
        )


class ForbiddenError(GraphQLError):
    """Forbidden error"""

    def __init__(self):
        super().__init__(
            "Forbidden",
            original_error=APIException(code=status.HTTP_403_FORBIDDEN),
        )


class NotFoundError(GraphQLError):
    """Not found error"""

    def __init__(self):
        super().__init__(
            "Not found",
            original_error=APIException(code=status.HTTP_404_NOT_FOUND),
        )
