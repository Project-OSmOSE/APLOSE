from backend.api.models import Label
from backend.utils.schema.filters import BaseFilterSet


class LabelFilterSet(BaseFilterSet):
    """Label filter set"""

    class Meta:
        model = Label
        fields = {
            "annotation__annotation_phase__annotation_campaign_id": ("exact",),
            "annotation__annotation_phase__phase": ("exact",),
            "annotation__annotator_id": ("exact",),
        }
