import graphene

from backend.utils.schema import AuthenticatedDjangoConnectionField
from .node import DetectorNode


class DetectorQuery(graphene.ObjectType):  # pylint: disable=too-few-public-methods
    """Detector queries"""

    all_detectors = AuthenticatedDjangoConnectionField(DetectorNode)
