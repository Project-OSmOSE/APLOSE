"""Dataset schema"""

from graphene import (
    String,
    Boolean,
    ObjectType,
    Mutation,
)


class ImportDatasetMutation(Mutation):
    class Arguments:
        name = String(required=True)
        path = String(required=True)
        legacy = Boolean()

    ok = Boolean()

    def mutate(root, info, name, path, legacy):
        print("mutate", info, name, path, legacy)
        ok = False


class DatasetMutation(ObjectType):
    """Dataset mutations"""

    import_dataset = ImportDatasetMutation.Field()
