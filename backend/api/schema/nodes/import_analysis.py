import graphene
from graphene import ObjectType


class ImportAnalysisNode(ObjectType):
    """Type for import dataset"""

    name = graphene.NonNull(graphene.String)
    path = graphene.NonNull(graphene.String)
