from backend.api.models import Label
from backend.utils.schema.filters import BaseFilterSet
from backend.utils.schema.types import BaseObjectType, BaseNode


class LabelFilterSet(BaseFilterSet):
    """Label filter set"""

    class Meta:
        model = Label
        fields = {
            "annotation__annotation_phase__annotation_campaign_id": ("exact",),
            "annotation__annotation_phase__phase": ("exact",),
            "annotation__annotator_id": ("exact",),
        }


class AnnotationLabelNode(BaseObjectType):
    """Label schema"""

    class Meta:
        # pylint: disable=missing-class-docstring, too-few-public-methods
        model = Label
        fields = "__all__"
        filterset_class = LabelFilterSet
        interfaces = (BaseNode,)
