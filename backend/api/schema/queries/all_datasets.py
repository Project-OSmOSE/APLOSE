from backend.api.schema.nodes import DatasetNode
from backend.utils.schema import AuthenticatedDjangoConnectionField

AllDatasetField = AuthenticatedDjangoConnectionField(DatasetNode)
