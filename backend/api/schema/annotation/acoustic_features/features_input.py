import graphene

from .features_node import SignalTrendType


class AcousticFeaturesInput(graphene.InputObjectType):

    id = graphene.ID()

    start_frequency = graphene.Float()
    end_frequency = graphene.Float()

    relative_max_frequency_count = graphene.Int()
    relative_min_frequency_count = graphene.Int()

    has_harmonics = graphene.Boolean()

    trend = SignalTrendType()

    steps_count = graphene.Int()
