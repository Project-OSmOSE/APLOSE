"""Annotation campaign list/retrieve serializer"""
from datetime import datetime

import pytz
from rest_framework import serializers
from rest_framework.fields import empty

from backend.api.models import (
    AnnotationCampaign,
    Dataset,
    LabelSet,
    Label,
    ConfidenceSet,
    SpectrogramAnalysis,
)
from backend.aplose.serializers import UserSerializer
from backend.utils.serializers import SlugRelatedGetOrCreateField
from ..common.archive import ArchiveSerializer
from ..data.dataset import DatasetSerializer


class AnnotationCampaignSerializer(serializers.ModelSerializer):
    """Serializer for annotation campaign"""

    label_set = serializers.PrimaryKeyRelatedField(read_only=True)
    labels_with_acoustic_features = SlugRelatedGetOrCreateField(
        slug_field="name",
        many=True,
        read_only=True,
    )
    allow_point_annotation = serializers.BooleanField(default=False)
    dataset = DatasetSerializer()
    analysis = serializers.PrimaryKeyRelatedField(
        queryset=SpectrogramAnalysis.objects.all(), many=True
    )
    owner = UserSerializer(read_only=True)
    confidence_set = serializers.PrimaryKeyRelatedField(
        queryset=ConfidenceSet.objects.all(), required=False, allow_null=True
    )
    archive = ArchiveSerializer(read_only=True)

    files_count = serializers.IntegerField(read_only=True)
    phases = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = AnnotationCampaign
        fields = "__all__"
        read_only = True


class AnnotationCampaignPostSerializer(serializers.ModelSerializer):
    """Serializer for annotation campaign creation"""

    label_set = serializers.PrimaryKeyRelatedField(read_only=True)
    labels_with_acoustic_features = SlugRelatedGetOrCreateField(
        slug_field="name",
        many=True,
        read_only=True,
    )
    allow_point_annotation = serializers.BooleanField(default=False)
    dataset = serializers.PrimaryKeyRelatedField(queryset=Dataset.objects.all())
    analysis = serializers.PrimaryKeyRelatedField(
        queryset=SpectrogramAnalysis.objects.all(), many=True, write_only=True
    )
    owner = UserSerializer(read_only=True)
    confidence_set = serializers.PrimaryKeyRelatedField(
        queryset=ConfidenceSet.objects.all(), required=False, allow_null=True
    )
    archive = ArchiveSerializer(read_only=True)

    files_count = serializers.IntegerField(read_only=True)
    phases = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = AnnotationCampaign
        fields = "__all__"
        write_only = True

    def validate_spectro_configs_in_dataset(self, attrs: dict) -> None:
        """Validates that chosen spectros correspond to chosen datasets"""
        analysis_list: list[SpectrogramAnalysis] = attrs["analysis"]
        dataset: Dataset = attrs["dataset"]
        bad_vals = []
        for analysis in analysis_list:
            if analysis not in dataset.spectrogram_analysis.all():
                bad_vals.append(str(analysis))
        if bad_vals:
            error = f"{bad_vals} not valid ids for spectro configs of given datasets ({dataset})"
            raise serializers.ValidationError({"analysis": error})

    def validate(self, attrs):
        attrs = super().validate(attrs)
        attrs["owner"] = self.context["request"].user
        if (
            "deadline" in attrs
            and attrs["deadline"] is not None
            and attrs["deadline"] < datetime.now(tz=pytz.UTC).date()
        ):
            raise serializers.ValidationError(
                {"deadline": "Deadline date should be in the future."},
                code="min_value",
            )
        self.validate_spectro_configs_in_dataset(attrs)
        return attrs


class AnnotationCampaignPatchSerializer(serializers.Serializer):
    """Serializer for annotation campaign"""

    label_set = serializers.PrimaryKeyRelatedField(
        queryset=LabelSet.objects.all(),
        required=False,
    )
    labels_with_acoustic_features = serializers.SlugRelatedField(
        queryset=Label.objects.all(),
        slug_field="name",
        required=False,
        many=True,
    )
    confidence_set = serializers.PrimaryKeyRelatedField(
        queryset=ConfidenceSet.objects.all(),
        required=False,
        allow_null=True,
    )
    allow_point_annotation = serializers.BooleanField(
        required=False,
    )

    class Meta:
        fields = "__all__"
        write_only = True

    def run_validation(self, data: dict = empty):
        if "label_set" in data and data.get("label_set") == 0:
            new_label_set = LabelSet.create_for_campaign(self.instance)
            data["label_set"] = new_label_set.id
        return super().run_validation(data)

    def create(self, validated_data):
        pass

    def update(self, instance: AnnotationCampaign, validated_data):
        if "label_set" in validated_data:
            instance.label_set = validated_data.get("label_set")
        if "labels_with_acoustic_features" in validated_data:
            label_set: LabelSet = instance.label_set or validated_data.get("label_set")
            for label in validated_data["labels_with_acoustic_features"]:
                if not label_set.labels.filter(name=label).exists():
                    message = "Label with acoustic features should belong to label set"
                    raise serializers.ValidationError(
                        {"labels_with_acoustic_features": message},
                    )
            instance.labels_with_acoustic_features.set(
                validated_data["labels_with_acoustic_features"]
            )
        if "confidence_set" in validated_data:
            instance.confidence_set = validated_data.get("confidence_set")
        if "allow_point_annotation" in validated_data:
            instance.allow_point_annotation = validated_data.get(
                "allow_point_annotation"
            )

        instance.save()
        return instance
