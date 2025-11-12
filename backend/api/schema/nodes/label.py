from backend.api.models import Label
from backend.api.schema.filter_sets import LabelFilterSet
from backend.utils.schema.types import BaseObjectType, BaseNode


class AnnotationLabelNode(BaseObjectType):
    """Label schema"""

    class Meta:
        model = Label
        fields = "__all__"
        filterset_class = LabelFilterSet
        interfaces = (BaseNode,)
