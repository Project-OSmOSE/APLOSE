"""Annotation comment serializer"""
from typing import Optional

from rest_framework import serializers
from rest_framework.fields import empty

from backend.api.models import AnnotationValidation
from backend.aplose.models import User
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

    def run_validation(self, data=empty):
        user: Optional[User] = self.context["user"] if "user" in self.context else None
        data["annotator"] = user.id or data["annotator"]
        data["annotation"] = (
            self.context["annotation_id"] if "annotation_id" in self.context else None
        )
        return super().run_validation(data)
