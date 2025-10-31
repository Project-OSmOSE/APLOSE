# pylint: disable=missing-module-docstring, missing-class-docstring, missing-function-docstring, duplicate-code

from django.test import TestCase
from freezegun import freeze_time

from backend.api.models import (
    AnnotationFileRange,
    Spectrogram,
    AnnotationPhase,
    Annotation,
    AcousticFeatures,
    SpectrogramAnalysis,
)
from backend.aplose.models import User
from backend.api.serializers import AnnotationSerializer
from backend.utils.tests import all_fixtures

features = {
    "start_frequency": 10.0,
    "end_frequency": 50.0,
    "relative_max_frequency_count": 5,
    "relative_min_frequency_count": 4,
    "steps_count": 2,
    "has_harmonics": True,
    "trend": "Modulated",
}
presence_result = {
    "label": "Boat",
    "confidence": "confident",
    "start_time": None,
    "end_time": None,
    "start_frequency": None,
    "end_frequency": None,
    "detector_configuration": None,
    "validations": [],
    "comments": [],
    "acoustic_features": None,
    "analysis": 1,
}
box_result = {
    "label": "Boat",
    "confidence": "confident",
    "start_time": 0.0,
    "end_time": 10.0,
    "start_frequency": 5.0,
    "end_frequency": 25.0,
    "detector_configuration": None,
    "validations": [],
    "comments": [],
    "acoustic_features": features,
    "analysis": 1,
}

USER_ID = 4
SPECTROGRAM_ID = 9
PHASE_ID = 1


class FakeRequest:
    def __init__(self, user: User):
        self.user = user


@freeze_time("2012-01-14 00:00:00")
class CreateTestCase(TestCase):
    fixtures = all_fixtures
    maxDiff = None  # See all differences on failed tests

    def _get_serializer(self, data, phase_id=PHASE_ID, spectrogram_id=SPECTROGRAM_ID):
        return AnnotationSerializer(
            data=data,
            context={
                "request": FakeRequest(User.objects.get(id=USER_ID)),
                "user": User.objects.get(pk=USER_ID),
                "phase": AnnotationPhase.objects.get(pk=phase_id),
                "spectrogram": Spectrogram.objects.get(pk=spectrogram_id),
            },
        )

    def test_presence(self):
        previous_count = Annotation.objects.count()
        serializer = self._get_serializer(presence_result)
        self.assertTrue(serializer.is_valid(raise_exception=True))
        serializer.save()

        self.assertEqual(Annotation.objects.count(), previous_count + 1)
        instance: Annotation = serializer.instance
        self.assertEqual(instance.type, Annotation.Type.WEAK)
        self.assertEqual(instance.label.name, "Boat")
        self.assertEqual(instance.confidence.label, "confident")
        self.assertEqual(instance.analysis_id, PHASE_ID)
        self.assertEqual(instance.spectrogram_id, SPECTROGRAM_ID)
        self.assertEqual(instance.annotator_id, USER_ID)
        self.assertIsNone(instance.acoustic_features)

    def test_box(self):
        previous_count = Annotation.objects.count()
        serializer = self._get_serializer(box_result)
        self.assertTrue(serializer.is_valid(raise_exception=True))
        serializer.save()

        self.assertEqual(Annotation.objects.count(), previous_count + 1)
        instance: Annotation = serializer.instance
        self.assertEqual(instance.type, Annotation.Type.BOX)
        self.assertEqual(instance.start_time, 0.0)
        self.assertEqual(instance.label.name, "Boat")
        self.assertEqual(instance.confidence.label, "confident")
        self.assertEqual(instance.analysis_id, PHASE_ID)
        self.assertEqual(instance.spectrogram_id, SPECTROGRAM_ID)
        self.assertEqual(instance.annotator_id, USER_ID)
        self.assertEqual(instance.acoustic_features.start_frequency, 10.0)

    # Corrected
    def test_wrong_order(self):
        serializer = self._get_serializer(
            {
                **presence_result,
                "start_time": 9 * 60,
                "end_time": 7 * 60,
                "start_frequency": 9_000,
                "end_frequency": 7_000,
            }
        )
        self.assertTrue(serializer.is_valid(raise_exception=True))
        self.assertEqual(serializer.data["start_time"], 7 * 60)
        self.assertEqual(serializer.data["end_time"], 9 * 60)
        self.assertEqual(serializer.data["start_frequency"], 7_000)
        self.assertEqual(serializer.data["end_frequency"], 9_000)

    # Errors
    def test_required(self):
        serializer = self._get_serializer({})
        self.assertFalse(serializer.is_valid(raise_exception=False))
        self.assertEqual(serializer.errors["label"][0].code, "required")
        self.assertEqual(serializer.errors["confidence"][0].code, "required")
        self.assertEqual(serializer.errors["analysis"][0].code, "required")

    def test_null(self):
        serializer = self._get_serializer(
            {
                "start_time": None,
                "end_time": None,
                "start_frequency": None,
                "end_frequency": None,
                "annotator": None,
                "detector_configuration": None,
                "label": None,
                "analysis": None,
                "confidence": None,  # Cannot be null since campaign has a confidence indicator set
                "comments": [],
                "validations": [],
            }
        )
        self.assertFalse(serializer.is_valid(raise_exception=False))
        self.assertListEqual(
            list(serializer.errors.keys()),
            [
                "label",
                "confidence",
                "analysis",
            ],
        )
        self.assertEqual(serializer.errors["label"][0].code, "null")
        self.assertEqual(serializer.errors["confidence"][0].code, "null")
        self.assertEqual(serializer.errors["analysis"][0].code, "null")

    def test_null_confidence_in_campaign_without_confidence(self):
        serializer = self._get_serializer(
            {
                "confidence": None,  # Can be null since campaign has no confidence indicator set
            },
            phase_id=2,
        )
        self.assertFalse(serializer.is_valid(raise_exception=False))
        self.assertNotIn("confidence", list(serializer.errors.keys()))

    def test_does_not_exist(self):
        serializer = self._get_serializer(
            {
                "label": "DCall",  # label exist in different label set
                "confidence": "test",
                "analysis": -1,
            }
        )
        self.assertFalse(serializer.is_valid(raise_exception=False))
        self.assertEqual(serializer.errors["label"][0].code, "does_not_exist")
        self.assertEqual(serializer.errors["confidence"][0].code, "does_not_exist")
        self.assertEqual(serializer.errors["analysis"][0].code, "does_not_exist")

    def test_min_value(self):
        serializer = self._get_serializer(
            {
                **presence_result,
                "start_time": -1,
                "end_time": -1,
                "start_frequency": -1,
                "end_frequency": -1,
            }
        )
        self.assertFalse(serializer.is_valid(raise_exception=False))
        self.assertEqual(serializer.errors["start_time"][0].code, "min_value")
        self.assertEqual(serializer.errors["end_time"][0].code, "min_value")
        self.assertEqual(serializer.errors["start_frequency"][0].code, "min_value")
        self.assertEqual(serializer.errors["start_frequency"][0].code, "min_value")

    def test_max_value(self):
        serializer = self._get_serializer(
            {
                **presence_result,
                "start_time": 16 * 60,
                "end_time": 17 * 60,
                "start_frequency": 130_000,
                "end_frequency": 140_000,
            }
        )
        self.assertFalse(serializer.is_valid(raise_exception=False))
        self.assertEqual(serializer.errors["start_time"][0].code, "max_value")
        self.assertEqual(serializer.errors["end_time"][0].code, "max_value")
        self.assertEqual(serializer.errors["start_frequency"][0].code, "max_value")
        self.assertEqual(serializer.errors["start_frequency"][0].code, "max_value")


@freeze_time("2012-01-14 00:00:00")
class UpdateTestCase(CreateTestCase):
    fixtures = all_fixtures

    def setUp(self):
        phase: AnnotationPhase = AnnotationPhase.objects.get(pk=1)
        annotator = (
            AnnotationFileRange.objects.filter(annotation_phase=phase).first().annotator
        )
        analysis: SpectrogramAnalysis = phase.annotation_campaign.analysis.first()
        features_instance = AcousticFeatures.objects.create(**features)
        self.instance = Annotation.objects.create(
            annotation_phase=phase,
            analysis=analysis,
            spectrogram=analysis.spectrograms.first(),
            annotator=annotator,
            label=phase.annotation_campaign.label_set.labels.first(),
            confidence=phase.annotation_campaign.confidence_set.confidence_indicators.first(),
            start_time=1,
            end_time=9,
            start_frequency=10,
            end_frequency=15,
            acoustic_features=features_instance,
        )

    def tearDown(self):
        self.instance.delete()

    def _get_serializer(self, data, phase_id=PHASE_ID, spectrogram_id=SPECTROGRAM_ID):
        return AnnotationSerializer(
            instance=self.instance,
            data=data,
            context={
                "request": FakeRequest(User.objects.get(id=USER_ID)),
                "user": User.objects.get(pk=USER_ID),
                "phase": AnnotationPhase.objects.get(pk=phase_id),
                "spectrogram": Spectrogram.objects.get(pk=spectrogram_id),
            },
        )

    def test_presence(self):
        previous_count = Annotation.objects.count()
        previous_features_count = AcousticFeatures.objects.count()
        serializer = self._get_serializer(presence_result)
        self.assertTrue(serializer.is_valid(raise_exception=True))
        serializer.save()

        self.assertEqual(Annotation.objects.count(), previous_count)
        self.assertEqual(AcousticFeatures.objects.count(), previous_features_count - 1)
        instance: Annotation = serializer.instance
        self.assertEqual(instance.type, Annotation.Type.WEAK)
        self.assertEqual(instance.label.name, "Boat")
        self.assertEqual(instance.confidence.label, "confident")
        self.assertEqual(instance.analysis_id, PHASE_ID)
        self.assertEqual(instance.spectrogram_id, SPECTROGRAM_ID)
        self.assertEqual(instance.annotator_id, USER_ID)
        self.assertIsNone(instance.acoustic_features)

    def test_box(self):
        previous_count = Annotation.objects.count()
        serializer = self._get_serializer(box_result)
        self.assertTrue(serializer.is_valid(raise_exception=True))
        serializer.save()

        self.assertEqual(Annotation.objects.count(), previous_count)
        instance: Annotation = serializer.instance
        self.assertEqual(instance.type, Annotation.Type.BOX)
        self.assertEqual(instance.start_time, 0.0)
        self.assertEqual(instance.label.name, "Boat")
        self.assertEqual(instance.confidence.label, "confident")
        self.assertEqual(instance.analysis_id, PHASE_ID)
        self.assertEqual(instance.spectrogram_id, SPECTROGRAM_ID)
        self.assertEqual(instance.annotator_id, USER_ID)
        self.assertEqual(instance.acoustic_features.start_frequency, 10.0)

    # Corrected
    def test_wrong_order(self):
        serializer = self._get_serializer(
            {
                **presence_result,
                "start_time": 9,
                "end_time": 7,
                "start_frequency": 9_000,
                "end_frequency": 7_000,
            }
        )
        self.assertTrue(serializer.is_valid(raise_exception=True))
        serializer.save()
        self.assertEqual(serializer.instance.start_time, 7)
        self.assertEqual(serializer.instance.end_time, 9)
        self.assertEqual(serializer.instance.start_frequency, 7_000)
        self.assertEqual(serializer.instance.end_frequency, 9_000)


@freeze_time("2012-01-14 00:00:00")
class CreateUpdateOfResultTestCase(TestCase):
    fixtures = all_fixtures
    maxDiff = None  # See all differences on failed tests

    def test_box_update_label(self):
        serializer = AnnotationSerializer(
            data={
                "is_update_of": 1,
                "analysis": 1,
                "label": "Mysticetes",
                "confidence": "confident",
                "start_time": 0.0,
                "end_time": 20.0,
                "start_frequency": 6.0,
                "end_frequency": 12.0,
                "detector_configuration": None,
                "validations": [],
                "comments": [],
                "acoustic_features": None,
            },
            context={
                "request": FakeRequest(User.objects.get(id=USER_ID)),
                "user": User.objects.get(pk=3),
                "phase": AnnotationPhase.objects.get(pk=1),
                "spectrogram": Spectrogram.objects.get(pk=7),
            },
        )
        self.assertTrue(serializer.is_valid(raise_exception=True))
        serializer.save()
        expected_result = {**serializer.data}
        # self.assertDictEqual(
        #     expected_result,
        #     {
        #         **result,
        #         "type": "Box",
        #         "last_updated_at": "2012-01-14T00:00:00Z",
        #         "annotator_expertise_level": None,
        #         "updated_to": [],
        #     },
        # )
        self.assertEqual(
            Annotation.objects.get(pk=1).updated_to.first().id,
            serializer.instance.id,
        )

        updated_serializer = AnnotationSerializer(
            instance=Annotation.objects.get(pk=1),
            context={
                "user": User.objects.get(pk=3),
                "phase": AnnotationPhase.objects.get(pk=1),
                "spectrogram": Spectrogram.objects.get(pk=7),
            },
        )
        # self.assertDictEqual(
        #     updated_serializer.data["updated_to"][0],
        #     {
        #         **result,
        #         "type": "Box",
        #         "last_updated_at": "2012-01-14T00:00:00Z",
        #         "annotator_expertise_level": None,
        #         "updated_to": [],
        #         "id": serializer.instance.id,
        #     },
        # )
