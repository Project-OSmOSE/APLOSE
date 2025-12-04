"""Annotation comment serializer"""
from typing import Optional

from rest_framework import serializers
from rest_framework.fields import empty

from backend.api.models import (
    AnnotationComment,
    AnnotationPhase,
    Spectrogram,
)
from backend.aplose.models import User
from backend.utils.serializers import ListSerializer


class AnnotationCommentSerializer(serializers.ModelSerializer):
    """Annotation comment"""

    class Meta:
        # pylint: disable=duplicate-code
        model = AnnotationComment
        fields = "__all__"
        list_serializer_class = ListSerializer
        extra_kwargs = {
            "id": {
                "required": False,
                "allow_null": True,
            },
            "annotation_phase": {
                "required": False,
            },
            "author": {
                "required": False,
            },
            "spectrogram": {
                "required": False,
            },
            "annotation": {
                "required": False,
            },
        }

    def run_validation(self, data=empty):
        phase: Optional[AnnotationPhase] = (
            self.context["phase"] if "phase" in self.context else None
        )
        spectrogram: Optional[Spectrogram] = (
            self.context["spectrogram"] if "spectrogram" in self.context else None
        )
        user: Optional[User] = self.context["user"] if "user" in self.context else None
        data["annotation_phase"] = phase.id or data["annotation_phase"]
        data["author"] = user.id or data["author"]
        data["spectrogram"] = spectrogram.id or data["spectrogram"]
        data["annotation"] = (
            self.context["annotation_id"] if "annotation_id" in self.context else None
        )
        return super().run_validation(data)
