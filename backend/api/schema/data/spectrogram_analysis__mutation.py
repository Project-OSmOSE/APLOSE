"""SpectrogramAnalysis schema"""

from graphene import (
    ObjectType,
    String,
    Mutation,
    Boolean,
)


class ImportSpectrogramAnalysisMutation(Mutation):
    class Arguments:
        dataset_name = String(required=True)
        dataset_path = String(required=True)
        legacy = Boolean()
        name = String(required=True)
        path = String(required=True)

    ok = Boolean()

    def mutate(root, info, dataset_name, dataset_path, legacy, name, path):
        print("mutate", info, dataset_name, dataset_path, legacy, name, path)
        ok = False


class SpectrogramAnalysisMutation(ObjectType):
    """SpectrogramAnalysis mutations"""

    import_spectrogram_analysis = ImportSpectrogramAnalysisMutation.Field()
