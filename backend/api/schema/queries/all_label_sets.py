from backend.api.schema.nodes import LabelSetNode
from backend.utils.schema import AuthenticatedDjangoConnectionField

AllLabelSetField = AuthenticatedDjangoConnectionField(LabelSetNode)
