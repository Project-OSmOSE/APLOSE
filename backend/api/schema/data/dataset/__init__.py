from graphene import ObjectType, Field, ID, List

from backend.utils.schema import (
    AuthenticatedDjangoConnectionField,
    GraphQLResolve,
    GraphQLPermissions,
)
from .all_datasets_available_for_import import (
    resolve_all_datasets_available_for_import,
    legacy_resolve_all_datasets_available_for_import,
)
from .dataset_node import DatasetNode
from .import_dataset_mutation import ImportDatasetMutation
from .import_dataset_type import ImportDatasetType


class DatasetQuery(ObjectType):
    """Dataset queries"""

    all_datasets = AuthenticatedDjangoConnectionField(DatasetNode)

    dataset_by_id = Field(DatasetNode, id=ID(required=True))

    @GraphQLResolve(permission=GraphQLPermissions.AUTHENTICATED)
    def resolve_dataset_by_id(self, info, id: int):  # pylint: disable=redefined-builtin
        """Get dataset by id"""
        return DatasetNode.get_node(info, id)

    all_datasets_available_for_import = List(ImportDatasetType)

    @GraphQLResolve(permission=GraphQLPermissions.STAFF_OR_SUPERUSER)
    def resolve_all_datasets_available_for_import(self, _):
        """Get all datasets for import"""
        datasets = resolve_all_datasets_available_for_import()
        legacy_datasets = legacy_resolve_all_datasets_available_for_import()
        return datasets + legacy_datasets


class DatasetMutation(ObjectType):  # pylint: disable=too-few-public-methods
    """Dataset mutations"""

    import_dataset = ImportDatasetMutation.Field()
