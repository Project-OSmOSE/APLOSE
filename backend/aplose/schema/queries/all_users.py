from backend.aplose.schema.nodes import UserNode
from backend.utils.schema import AuthenticatedDjangoConnectionField

AllUserField = AuthenticatedDjangoConnectionField(UserNode)
