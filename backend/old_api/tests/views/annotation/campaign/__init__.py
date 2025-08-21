"""Annotation campaigns tests"""
from .create import (
    CreateBaseUserAuthenticatedTestCase,
    CreateUnauthenticatedTestCase,
    CreateAdminAuthenticatedTestCase,
)
from .patch import (
    PatchUnauthenticatedTestCase,
    PatchAdminAuthenticatedTestCase,
)
