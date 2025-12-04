from typing import Optional

from django.core import validators
from django.db import transaction
from django.db.models import Max
from rest_framework import serializers
from rest_framework.fields import empty, FloatField

from backend.api.models import (
    Annotation,
    AnnotationPhase,
    Spectrogram,
    Label,
    Confidence,
    AnnotationValidation,
    SpectrogramAnalysis,
)
from backend.aplose.models import ExpertiseLevel, User
from backend.utils.serializers import EnumField, ListSerializer
from backend.api.context_filters import AnnotationCommentContextFilter
from .acoustic_features import AnnotationAcousticFeaturesSerializer
from .annotation_validation import AnnotationValidationSerializer
from .comment import AnnotationCommentSerializer


class AnnotationSerializer(serializers.ModelSerializer):
    type = EnumField(enum=Annotation.Type, read_only=True)
    annotator_expertise_level = EnumField(enum=ExpertiseLevel, read_only=True)

    label = serializers.SlugRelatedField(
        queryset=Label.objects.all(),
        slug_field="name",
    )
    confidence = serializers.SlugRelatedField(
        queryset=Confidence.objects.all(),
        slug_field="label",
        required=False,
        allow_null=True,
    )
    comments = AnnotationCommentSerializer(many=True, required=False)
    validations = AnnotationValidationSerializer(many=True, required=False)
    acoustic_features = AnnotationAcousticFeaturesSerializer(
        required=False, allow_null=True
    )

    class Meta:
        list_serializer_class = ListSerializer
        model = Annotation
        fields = "__all__"
        read_only_fields = [
            "type",
            "annotator_expertise_level",
        ]
        extra_kwargs = {
            "id": {"required": False, "allow_null": True, "read_only": False},
            "start_time": {"min_value": 0},
            "end_time": {"min_value": 0},
            "start_frequency": {"min_value": 0},
            "end_frequency": {"min_value": 0},
        }

    def get_fields(self):
        fields = super().get_fields()
        phase: Optional[AnnotationPhase] = self.context.get("phase", None)
        spectrogram: Optional[Spectrogram] = self.context.get("spectrogram", None)
        sampling_frequency = None

        if phase is not None:
            campaign = phase.annotation_campaign
            fields["label"].queryset = campaign.label_set.labels
            fields["spectrogram"].queryset = Spectrogram.objects.filter(
                analysis__in=campaign.analysis.all()
            ).distinct()
            fields["analysis"].queryset = SpectrogramAnalysis.objects.filter(
                id__in=campaign.analysis.values_list("id", flat=True)
            )
            if campaign.confidence_set is not None:
                fields["confidence"] = serializers.SlugRelatedField(
                    queryset=campaign.confidence_set.confidence_indicators.all(),
                    slug_field="label",
                    required=True,
                    allow_null=False,
                )
            sampling_frequency = (
                phase.annotation_campaign.dataset.spectrogram_analysis.aggregate(
                    sampling_frequency=Max("fft__sampling_frequency")
                ).get("sampling_frequency")
            )

        if spectrogram is not None:
            validator = validators.MaxValueValidator(
                spectrogram.duration,
                message=FloatField.default_error_messages["max_value"],
            )
            fields["start_time"].max_value = spectrogram.duration
            fields["start_time"].validators.append(validator)
            fields["end_time"].max_value = spectrogram.duration
            fields["end_time"].validators.append(validator)
            sampling_frequency = spectrogram.analysis.aggregate(
                sampling_frequency=Max("fft__sampling_frequency")
            ).get("sampling_frequency")

        if sampling_frequency is not None:
            validator = validators.MaxValueValidator(
                sampling_frequency / 2,
                message=FloatField.default_error_messages["max_value"],
            )
            fields["start_frequency"].max_value = sampling_frequency / 2
            fields["start_frequency"].validators.append(validator)
            fields["end_frequency"].max_value = sampling_frequency / 2
            fields["end_frequency"].validators.append(validator)

        return fields

    def run_validation(self, data=empty):
        phase: Optional[AnnotationPhase] = self.context.get("phase", None)
        spectrogram: Optional[Spectrogram] = self.context.get("spectrogram", None)
        annotator: Optional[User] = self.context.get("user", None)
        data["annotation_phase"] = phase.id if phase else None
        data["spectrogram"] = spectrogram.id if spectrogram else data["spectrogram"]
        data["annotator"] = annotator.id if annotator else None

        if self.context.get("force_max_frequency", False):
            if (
                float(data["start_frequency"])
                > self.fields["start_frequency"].max_value
            ):
                data["start_frequency"] = self.fields["start_frequency"].max_value
            if float(data["end_frequency"]) > self.fields["end_frequency"].max_value:
                data["end_frequency"] = self.fields["end_frequency"].max_value

        print(data)
        return super().run_validation(data)

    def validate(self, attrs: dict):
        # Reorder start/end
        start_time = attrs.get("start_time")
        end_time = attrs.get("end_time")
        if end_time is not None and (start_time is None or start_time > end_time):
            attrs["start_time"] = end_time
            attrs["end_time"] = start_time
        start_frequency = attrs.get("start_frequency")
        end_frequency = attrs.get("end_frequency")
        if end_frequency is not None and (
            start_frequency is None or start_frequency > end_frequency
        ):
            attrs["start_frequency"] = end_frequency
            attrs["end_frequency"] = start_frequency
        phase: Optional[AnnotationPhase] = (
            self.context["phase"] if "phase" in self.context else None
        )
        if (
            phase is not None
            and phase.phase == AnnotationPhase.Type.VERIFICATION
            and "annotator" in attrs
            and attrs.get("detector_configuration", None) is not None
        ):
            attrs.pop("annotator")

        return super().validate(attrs)

    @transaction.atomic
    def create(self, validated_data):
        comments = AnnotationCommentSerializer(
            validated_data.pop("comments", []), many=True
        ).data
        validations = AnnotationValidationSerializer(
            validated_data.pop("validations", []), many=True
        ).data
        initial_acoustic_features = validated_data.pop("acoustic_features", None)

        is_update_of = validated_data.pop("is_update_of", None)
        instance: Annotation = super().create(validated_data)

        self.update_comments(instance, comments)
        self.update_validations(instance, validations)

        # Acoustic features
        if initial_acoustic_features is not None:
            acoustic_features = AnnotationAcousticFeaturesSerializer(
                initial_acoustic_features
            ).data
            acoustic_features_serializer = AnnotationAcousticFeaturesSerializer(
                data=acoustic_features,
            )
            acoustic_features_serializer.is_valid(raise_exception=True)
            acoustic_features_serializer.save()
            instance.acoustic_features = acoustic_features_serializer.instance

        # is_update_of
        if is_update_of is not None:
            instance.is_update_of = is_update_of

        instance.save()
        return instance

    @transaction.atomic
    def update(self, instance: Annotation, validated_data):
        comments = AnnotationCommentSerializer(
            validated_data.pop("comments", []), many=True
        ).data
        validations = AnnotationValidationSerializer(
            validated_data.pop("validations", []), many=True
        ).data
        initial_acoustic_features = validated_data.pop("acoustic_features", None)

        if hasattr(instance, "first") and callable(getattr(instance, "first")):
            instance = instance.first()

        is_update_of = validated_data.pop("is_update_of", None)
        instance: Annotation = super().update(instance, validated_data)

        self.update_comments(instance, comments)
        self.update_validations(instance, validations)

        # acoustic_features
        if initial_acoustic_features is None:
            if instance.acoustic_features is not None:
                instance.acoustic_features.delete()
                instance.acoustic_features = None
        else:
            acoustic_features = AnnotationAcousticFeaturesSerializer(
                initial_acoustic_features
            ).data
            acoustic_features_serializer = AnnotationAcousticFeaturesSerializer(
                instance.acoustic_features,
                data=acoustic_features,
            )
            acoustic_features_serializer.is_valid(raise_exception=True)
            acoustic_features_serializer.save()
            instance.acoustic_features = acoustic_features_serializer.instance

        # is_update_of
        if is_update_of is not None:
            instance.is_update_of = is_update_of

        instance.save()
        return self.Meta.model.objects.get(pk=instance.id)

    def update_comments(self, instance: Annotation, validated_data):
        instances = AnnotationCommentContextFilter.get_edit_queryset(
            self.context["request"],
            annotation_phase=instance.annotation_phase,
            spectrogram=instance.spectrogram,
            author_id=instance.annotator,
            annotation_id=instance.id,
        )
        serializer = AnnotationCommentSerializer(
            instances,
            data=validated_data,
            many=True,
            context={
                "user": instance.annotator,
                "phase": instance.annotation_phase,
                "spectrogram": instance.spectrogram,
                "annotation_id": instance.id,
            },
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

    def update_validations(self, instance: Annotation, validated_data):
        instances = AnnotationValidation.objects.filter(
            annotation=instance,
            annotator=instance.annotator,
        )
        serializer = AnnotationValidationSerializer(
            instances,
            data=validated_data,
            many=True,
            context={
                "user": instance.annotator,
                "annotation_id": instance.id,
            },
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
