"""Annotation campaigns tests"""
from .archive import (
    ArchiveUnauthenticatedTestCase,
    ArchiveOwnerAuthenticatedTestCase,
    ArchiveAnnotatorAuthenticatedTestCase,
    ArchiveBaseUserAuthenticatedTestCase,
    ArchiveAdminAuthenticatedTestCase,
)
from .create import (
    CreateBaseUserAuthenticatedTestCase,
    CreateUnauthenticatedTestCase,
    CreateAdminAuthenticatedTestCase,
)
from .patch import (
    PatchUnauthenticatedTestCase,
    PatchAdminAuthenticatedTestCase,
)
from .retrieve import (
    RetrieveUnauthenticatedTestCase,
    RetrieveEmpyAdminAuthenticatedTestCase,
    RetrieveFilledAdminAuthenticatedTestCase,
    RetrieveFilledCampaignOwnerAuthenticatedTestCase,
    RetrieveFilledBaseUserAuthenticatedTestCase,
    RetrieveFilledBaseUserNoCampaignAuthenticatedTestCase,
)
