from backend.aplose.schema.nodes import UserGroupNode
from backend.utils.schema import AuthenticatedDjangoConnectionField

AllUserGroupsField = AuthenticatedDjangoConnectionField(UserGroupNode)
