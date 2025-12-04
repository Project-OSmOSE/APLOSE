from backend.api.models import AnnotationValidation
from backend.utils.schema.filters import BaseFilterSet


class AnnotationValidationFilterSet(BaseFilterSet):
    class Meta:
        model = AnnotationValidation
        fields = {
            "annotator": ["exact"],
        }
