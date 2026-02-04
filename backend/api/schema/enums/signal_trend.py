from django_extension.schema.types import ExtendedEnumType

from backend.api.models import AcousticFeatures


class SignalTrendType(ExtendedEnumType):
    """From AcousticFeatures.SignalTrend"""

    class Meta:
        enum = AcousticFeatures.SignalTrend

    Flat = "FLAT"
    Ascending = "ASC"
    Descending = "DESC"
    Modulated = "MOD"
