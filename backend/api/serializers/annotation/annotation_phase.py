"""Annotation campaign list/retrieve serializer"""

from rest_framework import serializers

from backend.api.models import (
    AnnotationCampaign,
    AnnotationPhase,
)
from backend.aplose.models import User
from backend.aplose.serializers.user import UserDisplayNameSerializer
from backend.utils.serializers import EnumField


class AnnotationPhaseSerializer(serializers.ModelSerializer):
    """Serializer for annotation phase"""

    phase = EnumField(AnnotationPhase.Type)
    annotation_campaign = serializers.PrimaryKeyRelatedField(
        queryset=AnnotationCampaign.objects.all()
    )

    created_by = UserDisplayNameSerializer(read_only=True)
    created_by_id = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=User.objects.all()
    )
    ended_by = UserDisplayNameSerializer(read_only=True)

    global_progress = serializers.IntegerField(read_only=True, default=0)
    global_total = serializers.IntegerField(read_only=True, default=0)
    user_progress = serializers.IntegerField(read_only=True, default=0)
    user_total = serializers.IntegerField(read_only=True, default=0)

    # has_annotations as a serializerMethod will give more requests but be quicker anyway:
    # on 22 items rendered:
    #  - SerializerMethodField: 47 queries | ~200ms
    #  - BooleanField on previous annotation: 7 queries | ~400ms
    has_annotations = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = AnnotationPhase
        fields = "__all__"

    def validate(self, attrs):
        attrs = super().validate(attrs)
        campaign: AnnotationCampaign = attrs.get("annotation_campaign")
        if (
            attrs.get("phase") == AnnotationPhase.Type.VERIFICATION
            and not campaign.phases.filter(
                phase=AnnotationPhase.Type.ANNOTATION
            ).exists()
        ):
            raise serializers.ValidationError(
                "Cannot create Verification phase without an Annotation phase first",
                code="invalid",
            )
        return attrs

    def get_has_annotations(self, phase: AnnotationPhase):
        """Return a boolean: if the phase has annotations or not"""
        if phase.phase == AnnotationPhase.Type.VERIFICATION:
            annotation_phase = phase.annotation_campaign.phases.filter(
                phase=AnnotationPhase.Type.ANNOTATION,
            )
            if annotation_phase.exists():
                return (
                    annotation_phase.first().annotations.exists()
                    or phase.annotations.exists()
                )
        return phase.annotations.exists()

    def create(self, validated_data):
        creator = validated_data.pop("created_by_id")
        validated_data["created_by"] = creator
        return super().create(validated_data)
