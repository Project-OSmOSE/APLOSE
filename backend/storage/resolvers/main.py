from ._model import ModelResolver
from ...api.models import SpectrogramAnalysis, Spectrogram


class Resolver(ModelResolver):
    """Main resolver class for storage"""

    @staticmethod
    def get_all_spectrograms_for_analysis(
        analysis: SpectrogramAnalysis,
    ) -> list[Spectrogram]:
        return ModelResolver.get_all_spectrograms_for_analysis(
            analysis=analysis,
        )
