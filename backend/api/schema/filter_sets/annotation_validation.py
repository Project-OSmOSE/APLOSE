from django_extension.filters import ExtendedFilterSet

from backend.api.models import AnnotationValidation


class AnnotationValidationFilterSet(ExtendedFilterSet):
    class Meta:
        model = AnnotationValidation
        fields = {
            "annotator": ["exact"],
        }
