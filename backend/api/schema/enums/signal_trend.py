import graphene


class SignalTrendType(graphene.Enum):
    """From SignalTrend"""

    Flat = "FLAT"
    Ascending = "ASC"
    Descending = "DESC"
    Modulated = "MOD"
