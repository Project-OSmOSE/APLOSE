import graphene

from .queries import BrowseField


class StorageQuery(graphene.ObjectType):
    browse = BrowseField
