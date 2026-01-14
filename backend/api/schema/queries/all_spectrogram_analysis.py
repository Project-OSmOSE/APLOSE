from backend.api.schema.nodes import SpectrogramAnalysisNode
from backend.utils.schema import AuthenticatedDjangoConnectionField

AllSpectrogramAnalysisField = AuthenticatedDjangoConnectionField(
    SpectrogramAnalysisNode
)
