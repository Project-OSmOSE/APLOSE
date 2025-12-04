from backend.api.schema.nodes import DetectorNode
from backend.utils.schema import AuthenticatedDjangoConnectionField

AllDetectorsField = AuthenticatedDjangoConnectionField(DetectorNode)
