from django.test import TestCase

from backend.api.models import AnnotationTask, AnnotationFileRange
from backend.utils.tests import all_fixtures


class AnnotationFileRangeTestCase(TestCase):
    fixtures = all_fixtures

    def test_update_delete_unrelated_tasks(self):
        file_range = AnnotationFileRange.objects.get(pk=1)
        self.assertEqual(AnnotationTask.objects.count(), 13)
        self.assertEqual(AnnotationFileRange.objects.count(), 6)

        files_count = file_range.files_count
        file_range.last_file_index -= 1
        file_range.save()

        self.assertEqual(AnnotationFileRange.objects.count(), 6)
        self.assertEqual(file_range.files_count, files_count - 1)
        self.assertEqual(AnnotationTask.objects.count(), 12)

    def test_update_fails_if_task_is_finished(self):
        file_range = AnnotationFileRange.objects.get(pk=1)
        self.assertEqual(AnnotationTask.objects.count(), 13)
        self.assertEqual(AnnotationFileRange.objects.count(), 6)

        files_count = file_range.files_count
        file_range.first_file_index = 1
        self.assertRaises(AnnotationTask.CannotDeleteFinished, file_range.save)

        self.assertEqual(AnnotationFileRange.objects.count(), 6)
        self.assertEqual(file_range.files_count, files_count)
        self.assertEqual(AnnotationTask.objects.count(), 13)

    def test_update_forced_doesnt_fails_if_task_is_finished(self):
        file_range = AnnotationFileRange.objects.get(pk=1)
        self.assertEqual(AnnotationTask.objects.count(), 13)
        self.assertEqual(AnnotationFileRange.objects.count(), 6)

        files_count = file_range.files_count
        file_range.first_file_index = 1
        file_range.save(force=True)

        self.assertEqual(AnnotationFileRange.objects.count(), 6)
        self.assertEqual(file_range.files_count, files_count - 1)
        self.assertEqual(AnnotationTask.objects.count(), 12)

    def test_delete_also_delete_tasks(self):
        self.assertEqual(AnnotationFileRange.objects.count(), 6)
        self.assertEqual(AnnotationTask.objects.count(), 13)
        AnnotationFileRange.objects.get(pk=3).delete()
        self.assertEqual(AnnotationFileRange.objects.count(), 5)
        self.assertEqual(AnnotationTask.objects.count(), 9)

    def test_delete_fails_if_task_is_finished(self):
        file_range = AnnotationFileRange.objects.get(pk=1)
        self.assertEqual(AnnotationTask.objects.count(), 13)
        self.assertEqual(AnnotationFileRange.objects.count(), 6)

        self.assertRaises(AnnotationTask.CannotDeleteFinished, file_range.delete)

        self.assertEqual(AnnotationFileRange.objects.count(), 6)
        self.assertEqual(AnnotationTask.objects.count(), 13)

    def test_delete_forced_doesnt_fails_if_task_is_finished(self):
        file_range = AnnotationFileRange.objects.get(pk=1)
        self.assertEqual(AnnotationTask.objects.count(), 13)
        self.assertEqual(AnnotationFileRange.objects.count(), 6)

        file_range.delete(force=True)

        self.assertEqual(AnnotationFileRange.objects.count(), 5)
        self.assertEqual(AnnotationTask.objects.count(), 7)
