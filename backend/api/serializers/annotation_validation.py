"""Annotation comment serializer"""

from django.db.models import QuerySet
from rest_framework import serializers
from rest_framework.fields import empty

from backend.api.models import AnnotationValidation
from backend.utils.serializers import ListSerializer


class AnnotationValidationSerializer(serializers.ModelSerializer):
    """Annotation validation"""

    class Meta:
        model = AnnotationValidation
        fields = "__all__"
        list_serializer_class = ListSerializer
        extra_kwargs = {
            "id": {
                "required": False,
                "allow_null": True,
            },
            "annotation": {
                "required": False,
            },
            "annotator": {
                "required": False,
            },
        }

    def __init__(self, instance=None, data=empty, **kwargs):
        # pylint: disable=duplicate-code
        if isinstance(instance, QuerySet):
            if instance.count() == 1:
                instance = instance.first()
            elif not instance.exists():
                instance = None
        super().__init__(instance, data, **kwargs)

    def run_validation(self, data: dict = empty):

        if not data.get("annotator") and self.context.get("user") is not None:
            data["annotator"] = self.context.get("user").id

        if data.get("id"):
            self.instance = AnnotationValidation.objects.get(pk=data.get("id"))
        elif data.get("annotation") and data.get("annotator"):
            instance = AnnotationValidation.objects.filter(
                annotation_id=data.get("annotation"),
                annotator_id=data.get("annotator"),
            )
            self.instance = instance.first() if instance.exists() else None

        return super().run_validation(data)
