from typing import Optional

from django.db import transaction
from django.db.models import Max
from django.shortcuts import get_object_or_404
from rest_framework import serializers
from rest_framework.fields import empty

from backend.api.models import (
    Annotation,
    AnnotationPhase,
    Spectrogram,
    Label,
    Confidence,
    DetectorConfiguration,
    AnnotationValidation,
    SpectrogramAnalysis,
)
from backend.aplose.models import ExpertiseLevel
from backend.utils.serializers import EnumField, ListSerializer
from .acoustic_features import AnnotationAcousticFeaturesSerializer
from .annotation_validation import AnnotationValidationSerializer
from .comment import AnnotationCommentSerializer
from backend.api.schema.context_filters import AnnotationCommentContextFilter


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
        }

    def get_fields(self):
        fields = super().get_fields()
        phase: Optional[AnnotationPhase] = (
            self.context["phase"] if "phase" in self.context else None
        )
        if phase is not None:
            campaign = phase.annotation_campaign
            fields["label"].queryset = campaign.label_set.labels
            fields["spectrogram"].queryset = Spectrogram.objects.filter(
                analysis__in=campaign.analysis.all()
            )
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

        spectrogram: Optional[Spectrogram] = (
            self.context["spectrogram"] if "spectrogram" in self.context else None
        )
        if spectrogram is not None:
            fields["start_time"] = serializers.FloatField(
                required=False,
                allow_null=True,
                min_value=0.0,
                max_value=spectrogram.duration,
            )
            fields["end_time"] = serializers.FloatField(
                required=False,
                allow_null=True,
                min_value=0.0,
                max_value=spectrogram.duration,
            )
            sampling_frequency = spectrogram.analysis.aggregate(
                sampling_frequency=Max("fft__sampling_frequency")
            ).get("sampling_frequency")
            fields["start_frequency"] = serializers.FloatField(
                required=False,
                allow_null=True,
                min_value=0.0,
                max_value=sampling_frequency / 2,
            )
            fields["end_frequency"] = serializers.FloatField(
                required=False,
                allow_null=True,
                min_value=0.0,
                max_value=sampling_frequency / 2,
            )

        return fields

    def run_validation(self, data=empty):
        phase: Optional[AnnotationPhase] = (
            self.context["phase"] if "phase" in self.context else None
        )
        spectrogram: Optional[Spectrogram] = (
            self.context["spectrogram"] if "spectrogram" in self.context else None
        )
        data["annotation_phase"] = phase.id
        data["spectrogram"] = spectrogram.id
        data["annotator"] = self.context["user"].id if "user" in self.context else None
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
        detector_configuration = attrs.get("detector_configuration")
        if detector_configuration is not None:
            (
                attrs["detector_configuration"],
                _,
            ) = DetectorConfiguration.objects.get_or_create(
                detector_id=detector_configuration["detector"].id,
                configuration=detector_configuration["configuration"],
            )
        if (
            phase is not None
            and phase.phase == AnnotationPhase.Type.VERIFICATION
            and "annotator" in attrs
            and detector_configuration is not None
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


class AnnotationImportSerializer(AnnotationSerializer):
    class Meta(AnnotationSerializer.Meta):
        pass

    def run_validation(self, data=empty):
        phase: Optional[AnnotationPhase] = (
            self.context["phase"] if "phase" in self.context else None
        )
        data["spectrogram"] = get_object_or_404(
            Spectrogram,
            filename=data["spectrogram"],
            dataset=phase.annotation_campaign.dataset,
        )
        return super().run_validation(data)
