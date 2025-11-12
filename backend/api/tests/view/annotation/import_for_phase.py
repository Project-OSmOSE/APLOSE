"""Test AnnotationViewSet"""
import os
from typing import Optional

from django.db.models import QuerySet
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from backend.api.models import (
    LabelSet,
    ConfidenceSet,
    AnnotationPhase,
    AnnotationCampaign,
    AnnotationTask,
    Annotation,
    ConfidenceIndicatorSetIndicator,
    Confidence,
)
from backend.api.models.annotation.annotation_campaign import AnnotationCampaignAnalysis
from backend.api.tests.fixtures import DATA_FIXTURES
from backend.utils.tests import upload_csv_file_as_string

URL = reverse(
    "annotation-phase-import", kwargs={"campaign_id": 1, "phase_type": "Annotation"}
)
URL_unknown_campaign = reverse(
    "annotation-phase-import", kwargs={"campaign_id": 27, "phase_type": "Annotation"}
)

DATASET_NAME = "SPM Aural A 2010"
detectors_map = {"detector1": {"detector": "nnini", "configuration": "test"}}


class ImportAnnotationsForPhaseTestCase(APITestCase):
    """Test Import Annotations"""

    fixtures = [
        "users",
        *DATA_FIXTURES,
    ]

    def _get_url(
        self,
        # pylint: disable=dangerous-default-value
        phase_type: AnnotationPhase.Type = AnnotationPhase.Type.ANNOTATION,
        label_set: Optional[LabelSet] = None,
        confidence_set: Optional[ConfidenceSet] = None,
        campaign_id: Optional[int] = None,
    ):
        if campaign_id is None:
            campaign = AnnotationCampaign.objects.create(
                name="string",
                description="string",
                instructions_url="string",
                deadline="2022-01-30",
                created_at="2012-01-14T00:00:00Z",
                label_set=label_set or LabelSet.objects.create(name="string label set"),
                confidence_set=confidence_set,
                owner_id=3,
                dataset_id=1,
            )
            AnnotationCampaignAnalysis.objects.create(
                annotation_campaign_id=campaign.id, analysis_id=1
            )
            campaign_id = campaign.id
        phase = AnnotationPhase.objects.create(
            phase=phase_type,
            annotation_campaign_id=campaign_id,
            created_by_id=3,
        )
        verification_phase, _ = AnnotationPhase.objects.get_or_create(
            phase=AnnotationPhase.Type.VERIFICATION,
            annotation_campaign_id=campaign_id,
            created_by_id=3,
        )
        task = AnnotationTask.objects.create(
            annotation_phase=verification_phase,
            spectrogram_id=2,
            annotator_id=1,
            status=AnnotationTask.Status.FINISHED,
        )

        return (
            reverse(
                "annotation-phase-import",
                kwargs={"campaign_id": campaign_id, "phase_type": phase_type},
            ),
            phase.id,
            task.id,
        )

    def __check_global_result(self, annotation: Annotation):
        self.assertEqual(annotation.label.name, "click")
        self.assertEqual(annotation.confidence.label, "sure")
        self.assertEqual(annotation.annotator, None)
        self.assertEqual(annotation.annotation_comments.count(), 0)
        self.assertEqual(annotation.validations.count(), 0)
        self.assertEqual(annotation.detector_configuration.detector.name, "nnini")
        self.assertEqual(annotation.detector_configuration.configuration, "test")
        self.assertIsNotNone(LabelSet.objects.get(name="string label set"))
        self.assertIsNotNone(ConfidenceSet.objects.get(name="string"))

    def __check_weak_one_file_annotation(self, annotation: Annotation, phase_id: int):
        self.__check_global_result(annotation)
        self.assertEqual(annotation.annotation_phase_id, phase_id)
        self.assertEqual(annotation.spectrogram_id, 1)
        self.assertEqual(annotation.type, Annotation.Type.WEAK)
        self.assertEqual(annotation.start_time, None)
        self.assertEqual(annotation.end_time, None)
        self.assertEqual(annotation.start_frequency, None)
        self.assertEqual(annotation.end_frequency, None)

    def __check_weak_two_files_annotation(
        self, annotations: QuerySet[Annotation], phase_id: int
    ):
        annotation_1: Annotation = annotations.first()
        self.__check_global_result(annotation_1)
        # First annotation cover all file -> weak
        self.assertEqual(annotation_1.annotation_phase_id, phase_id)
        self.assertEqual(annotation_1.spectrogram_id, 1)
        self.assertEqual(annotation_1.start_time, None)
        self.assertEqual(annotation_1.end_time, None)
        self.assertEqual(annotation_1.start_frequency, None)
        self.assertEqual(annotation_1.end_frequency, None)
        self.assertEqual(annotation_1.type, Annotation.Type.WEAK)
        annotation_2: Annotation = annotations.exclude(id=annotation_1.id).first()
        # Second annotation doesn't cover all file -> strong
        self.__check_global_result(annotation_2)
        self.assertEqual(annotation_2.annotation_phase_id, phase_id)
        self.assertEqual(annotation_2.spectrogram_id, 2)
        self.assertEqual(annotation_2.start_time, 0)
        self.assertEqual(annotation_2.end_time, 10 * 60)
        self.assertEqual(annotation_2.start_frequency, 0)
        self.assertEqual(annotation_2.end_frequency, 64_000)
        self.assertEqual(annotation_2.type, Annotation.Type.BOX)

    def __check_point_annotation(self, annotation: Annotation, phase_id: int):
        self.__check_global_result(annotation)
        self.assertEqual(annotation.annotation_phase_id, phase_id)
        self.assertEqual(annotation.spectrogram_id, 1)
        self.assertEqual(annotation.type, Annotation.Type.POINT)
        self.assertEqual(annotation.start_time, 0.8)
        self.assertEqual(annotation.end_time, None)
        self.assertEqual(annotation.start_frequency, 32416)
        self.assertEqual(annotation.end_frequency, None)

    def __check_box_one_file_annotation(self, annotation: Annotation, phase_id: int):
        self.__check_global_result(annotation)
        self.assertEqual(annotation.annotation_phase_id, phase_id)
        self.assertEqual(annotation.spectrogram_id, 1)
        self.assertEqual(annotation.start_time, 0.8)
        self.assertEqual(annotation.end_time, 1.8)
        self.assertEqual(annotation.start_frequency, 32416)
        self.assertEqual(annotation.end_frequency, 53916)
        self.assertEqual(annotation.type, Annotation.Type.BOX)

    def __check_box_two_files_annotation(
        self, annotations: QuerySet[Annotation], phase_id: int
    ):
        annotation_1: Annotation = annotations.first()
        self.__check_global_result(annotation_1)
        self.assertEqual(annotation_1.annotation_phase_id, phase_id)
        self.assertEqual(annotation_1.spectrogram_id, 1)
        self.assertEqual(annotation_1.start_time, 0.8)
        self.assertEqual(annotation_1.end_time, 15 * 60)
        self.assertEqual(annotation_1.start_frequency, 32416)
        self.assertEqual(annotation_1.end_frequency, 53916)
        self.assertEqual(annotation_1.type, Annotation.Type.BOX)
        annotation_2: Annotation = annotations.exclude(id=annotation_1.id).first()
        self.__check_global_result(annotation_2)
        self.assertEqual(annotation_2.annotation_phase_id, phase_id)
        self.assertEqual(annotation_2.spectrogram_id, 2)
        self.assertEqual(annotation_2.start_time, 0)
        self.assertEqual(annotation_2.end_time, 8)
        self.assertEqual(annotation_2.start_frequency, 32416)
        self.assertEqual(annotation_2.end_frequency, 53916)
        self.assertEqual(annotation_2.type, Annotation.Type.BOX)

    def tearDown(self):
        """Logout when tests ends"""
        self.client.logout()

    def test_not_connected(self):
        """ViewSet returns 401 if no user is authenticated"""
        url, _, _ = self._get_url()
        response = upload_csv_file_as_string(
            self,
            url,
            f"{os.path.dirname(os.path.realpath(__file__))}/import_csv/box_one_file_annotation.csv",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_base_user(self):
        self.client.login(username="user2", password="osmose29")
        url, _, _ = self._get_url()
        response = upload_csv_file_as_string(
            self,
            url,
            f"{os.path.dirname(os.path.realpath(__file__))}/import_csv/box_one_file_annotation.csv",
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # Weak

    def test_campaign_owner_weak_one_file(self):
        self.client.login(username="user1", password="osmose29")
        url, phase_id, task_id = self._get_url()
        old_count = Annotation.objects.count()
        phase = AnnotationPhase.objects.get(id=phase_id)
        self.assertEqual(phase.annotation_campaign.label_set.labels.count(), 0)
        response = upload_csv_file_as_string(
            self,
            url,
            f"{os.path.dirname(os.path.realpath(__file__))}/import_csv/weak_one_file_annotation.csv",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Annotation.objects.count(), old_count + 1)
        self.assertEqual(
            AnnotationTask.objects.get(id=task_id).status,
            AnnotationTask.Status.FINISHED,
        )

        result = Annotation.objects.latest("id")
        self.__check_weak_one_file_annotation(result, phase_id)

        self.assertEqual(phase.annotation_campaign.label_set.labels.count(), 1)

    def test_campaign_owner_weak_one_file_twice(self):
        self.client.login(username="user1", password="osmose29")
        url, _, task_id = self._get_url()
        old_count = Annotation.objects.count()
        response = upload_csv_file_as_string(
            self,
            url,
            f"{os.path.dirname(os.path.realpath(__file__))}/import_csv/weak_one_file_annotation.csv",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Annotation.objects.count(), old_count + 1)
        response = upload_csv_file_as_string(
            self,
            url,
            f"{os.path.dirname(os.path.realpath(__file__))}/import_csv/weak_one_file_annotation.csv",
        )
        self.assertEqual(
            AnnotationTask.objects.get(id=task_id).status,
            AnnotationTask.Status.FINISHED,
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Annotation.objects.count(), old_count + 1)

    def test_campaign_owner_weak_two_file(self):
        self.client.login(username="user1", password="osmose29")
        url, phase_id, task_id = self._get_url()
        olds_annotations = Annotation.objects.all()
        old_count = olds_annotations.count()
        old_ids = list(olds_annotations.values_list("id", flat=True))
        response = upload_csv_file_as_string(
            self,
            url,
            f"{os.path.dirname(os.path.realpath(__file__))}/import_csv/weak_two_files_annotation.csv",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Annotation.objects.count(), old_count + 2)
        self.assertEqual(
            AnnotationTask.objects.get(id=task_id).status,
            AnnotationTask.Status.CREATED,
        )

        results = Annotation.objects.exclude(id__in=old_ids)
        self.__check_weak_two_files_annotation(results, phase_id)

    def test_campaign_owner_weak_duplicate_used_label_set(self):
        self.client.login(username="user1", password="osmose29")
        old_label_set = LabelSet.objects.create(name="Filled")
        old_label_set.labels.create(name="Whale")
        old_label_set.labels.create(name="Dolphins")

        url, phase_id, task_id = self._get_url(label_set=old_label_set)

        AnnotationCampaign.objects.create(
            name="Other", label_set=old_label_set, owner_id=1, dataset_id=1
        )

        old_count = Annotation.objects.count()
        old_set_count = LabelSet.objects.count()
        phase = AnnotationPhase.objects.get(id=phase_id)
        old_labels_count = phase.annotation_campaign.label_set.labels.count()
        response = upload_csv_file_as_string(
            self,
            url,
            f"{os.path.dirname(os.path.realpath(__file__))}/import_csv/weak_one_file_annotation.csv",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Annotation.objects.count(), old_count + 1)
        self.assertEqual(
            AnnotationTask.objects.get(id=task_id).status,
            AnnotationTask.Status.FINISHED,
        )

        self.assertEqual(LabelSet.objects.count(), old_set_count + 1)
        phase = AnnotationPhase.objects.get(id=phase_id)
        self.assertEqual(
            phase.annotation_campaign.label_set.labels.count(), old_labels_count + 1
        )
        self.assertNotEqual(phase.annotation_campaign.label_set, old_label_set)
        self.assertEqual(old_label_set.labels.count(), old_labels_count)

    def test_campaign_owner_weak_duplicate_used_confidence_set(self):
        self.client.login(username="user1", password="osmose29")
        old_confidence_set = ConfidenceSet.objects.create(name="Filled")
        ConfidenceIndicatorSetIndicator.objects.get_or_create(
            confidence=Confidence.objects.create(label="Not confident", level=0),
            confidence_set=old_confidence_set,
        )
        ConfidenceIndicatorSetIndicator.objects.get_or_create(
            confidence=Confidence.objects.create(label="Confident", level=1),
            confidence_set=old_confidence_set,
        )

        url, phase_id, task_id = self._get_url(confidence_set=old_confidence_set)
        phase = AnnotationPhase.objects.get(id=phase_id)

        AnnotationCampaign.objects.create(
            name="Other",
            label_set=phase.annotation_campaign.label_set,
            owner_id=1,
            confidence_set=old_confidence_set,
            dataset_id=1,
        )

        old_count = Annotation.objects.count()
        old_set_count = ConfidenceSet.objects.count()
        phase = AnnotationPhase.objects.get(id=phase_id)
        old_indicators_count = (
            phase.annotation_campaign.confidence_set.confidence_indicators.count()
        )
        response = upload_csv_file_as_string(
            self,
            url,
            f"{os.path.dirname(os.path.realpath(__file__))}/import_csv/weak_one_file_annotation.csv",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Annotation.objects.count(), old_count + 1)
        self.assertEqual(
            AnnotationTask.objects.get(id=task_id).status,
            AnnotationTask.Status.FINISHED,
        )

        self.assertEqual(LabelSet.objects.count(), old_set_count + 1)
        phase = AnnotationPhase.objects.get(id=phase_id)
        self.assertEqual(
            phase.annotation_campaign.confidence_set.confidence_indicators.count(),
            old_indicators_count + 1,
        )
        self.assertNotEqual(
            phase.annotation_campaign.confidence_set, old_confidence_set
        )
        self.assertEqual(
            old_confidence_set.confidence_indicators.count(), old_indicators_count
        )

    # Point

    def test_campaign_owner_point(self):
        self.client.login(username="user1", password="osmose29")
        url, phase_id, task_id = self._get_url()
        old_count = Annotation.objects.count()
        response = upload_csv_file_as_string(
            self,
            url,
            f"{os.path.dirname(os.path.realpath(__file__))}/import_csv/point_annotation.csv",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Annotation.objects.count(), old_count + 1)
        self.assertEqual(
            AnnotationTask.objects.get(id=task_id).status,
            AnnotationTask.Status.FINISHED,
        )

        self.__check_point_annotation(Annotation.objects.latest("id"), phase_id)

    def test_campaign_owner_point_no_end_frequency(self):
        self.client.login(username="user1", password="osmose29")
        url, phase_id, _ = self._get_url()
        old_count = Annotation.objects.count()
        response = upload_csv_file_as_string(
            self,
            url,
            f"{os.path.dirname(os.path.realpath(__file__))}/import_csv/point_annotation_no_end_frequency.csv",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Annotation.objects.count(), old_count + 1)

        result = Annotation.objects.latest("id")
        self.__check_point_annotation(result, phase_id)

    # Box

    def test_campaign_owner_box_one_file(self):
        self.client.login(username="user1", password="osmose29")
        url, phase_id, task_id = self._get_url()
        old_count = Annotation.objects.count()
        response = upload_csv_file_as_string(
            self,
            url,
            f"{os.path.dirname(os.path.realpath(__file__))}/import_csv/box_one_file_annotation.csv",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Annotation.objects.count(), old_count + 1)
        self.assertEqual(
            AnnotationTask.objects.get(id=task_id).status,
            AnnotationTask.Status.FINISHED,
        )

        result = Annotation.objects.latest("id")
        self.__check_box_one_file_annotation(result, phase_id)

    def test_campaign_owner_box_two_file(self):
        self.client.login(username="user1", password="osmose29")
        url, phase_id, task_id = self._get_url()
        old_results = Annotation.objects.all()
        old_count = old_results.count()
        old_ids = list(old_results.values_list("id", flat=True))
        response = upload_csv_file_as_string(
            self,
            url,
            f"{os.path.dirname(os.path.realpath(__file__))}/import_csv/box_two_files_annotation.csv",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Annotation.objects.count(), old_count + 2)
        self.assertEqual(
            AnnotationTask.objects.get(id=task_id).status,
            AnnotationTask.Status.CREATED,
        )

        results = Annotation.objects.exclude(id__in=old_ids)
        self.__check_box_two_files_annotation(results, phase_id)

    # Errors

    def test_campaign_owner_incorrect_time(self):
        self.client.login(username="user1", password="osmose29")
        url, _, _ = self._get_url()
        old_count = Annotation.objects.count()
        response = upload_csv_file_as_string(
            self,
            url,
            f"{os.path.dirname(os.path.realpath(__file__))}/import_csv/incorrect_time.csv",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Annotation.objects.count(), old_count)

        self.assertEqual(
            str(response.data[0]),
            "This start and end datetime does not belong to any spectrogram of the dataset",
        )

    def test_campaign_owner_incorrect_time_forced(self):
        self.client.login(username="user1", password="osmose29")
        url, _, _ = self._get_url()
        old_count = Annotation.objects.count()
        response = upload_csv_file_as_string(
            self,
            url + "?force_datetime=true",
            f"{os.path.dirname(os.path.realpath(__file__))}/import_csv/incorrect_time.csv",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Annotation.objects.count(), old_count)

    def test_campaign_owner_bellow_frequency(self):
        self.client.login(username="user1", password="osmose29")
        url, _, _ = self._get_url()
        old_count = Annotation.objects.count()
        response = upload_csv_file_as_string(
            self,
            url,
            f"{os.path.dirname(os.path.realpath(__file__))}/import_csv/bellow_frequency.csv",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Annotation.objects.count(), old_count)

        self.assertEqual(response.data[0].get("start_frequency")[0].code, "min_value")
        self.assertEqual(response.data[0].get("end_frequency")[0].code, "min_value")

    def test_campaign_owner_over_frequency(self):
        self.client.login(username="user1", password="osmose29")
        url, _, _ = self._get_url()
        old_count = Annotation.objects.count()
        response = upload_csv_file_as_string(
            self,
            url,
            f"{os.path.dirname(os.path.realpath(__file__))}/import_csv/over_frequency.csv",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Annotation.objects.count(), old_count)

        self.assertEqual(response.data[0].get("start_frequency")[0].code, "max_value")
        self.assertEqual(response.data[0].get("end_frequency")[0].code, "max_value")

    def test_campaign_owner_over_frequency_forced(self):
        self.client.login(username="user1", password="osmose29")
        url, _, _ = self._get_url()
        old_count = Annotation.objects.count()
        response = upload_csv_file_as_string(
            self,
            url + "?force_max_frequency=true",
            f"{os.path.dirname(os.path.realpath(__file__))}/import_csv/over_frequency.csv",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Annotation.objects.count(), old_count + 1)

    def test_campaign_owner_on_verification_phase(self):
        self.client.login(username="user1", password="osmose29")
        url, _, _ = self._get_url(phase_type=AnnotationPhase.Type.VERIFICATION)
        old_count = Annotation.objects.count()
        response = upload_csv_file_as_string(
            self,
            url,
            f"{os.path.dirname(os.path.realpath(__file__))}/import_csv/box_one_file_annotation.csv",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Annotation.objects.count(), old_count)
        self.assertEqual(
            response.data, "Import should always be made on annotation campaign"
        )
