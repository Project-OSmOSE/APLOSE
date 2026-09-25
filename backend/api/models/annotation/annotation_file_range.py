"""File range model"""
from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models
from django.db.models import Exists, Subquery, OuterRef, signals, Func, F, Q, QuerySet
from django.dispatch import receiver
from django_extension.models import ExtendedQuerySet

from backend.aplose.models import User
from .annotation_task import AnnotationTask
from ..data import Spectrogram


class AnnotationFileRangeQuerySet(ExtendedQuerySet):
    """AnnotationCampaign custom manager"""

    def filter_viewable_by(self, user: User, **kwargs):
        qs = super().filter_viewable_by(user, **kwargs)

        # Admin can view all file ranges
        if user.is_staff or user.is_superuser:
            return qs

        return qs.filter(
            # Campaign owner can view its file ranges
            Q(annotation_phase__annotation_campaign__owner_id=user.id)
            |
            # Phase creator can view its file ranges
            Q(annotation_phase__created_by_id=user.id)
            |
            # Other can only view campaigns with assigned open phase
            Q(
                # Assigned file range
                annotator=user,
                # Open phase
                annotation_phase__ended_at__isnull=True,
                annotation_phase__ended_by__isnull=True,
                # Open campaigns
                annotation_phase__annotation_campaign__archive__isnull=True,
            )
        )

    def filter_editable_by(self, user: User, **kwargs):
        qs = super().filter_viewable_by(user, **kwargs)

        # Only open campaign and phase file ranges can be edited
        open_campaigns = qs.filter(
            # Open campaigns
            annotation_phase__annotation_campaign__archive__isnull=True,
            # Open phase
            annotation_phase__ended_at__isnull=True,
            annotation_phase__ended_by__isnull=True,
        )

        # Admin can edit all file ranges
        if user.is_staff or user.is_superuser:
            return open_campaigns

        return open_campaigns.filter(
            # Campaign owner can edit their file ranges
            Q(annotation_phase__annotation_campaign__owner_id=user.id)
            |
            # Phase creator can edit their file ranges
            Q(annotation_phase__created_by_id=user.id)
        )


class AnnotationFileRange(models.Model):
    """Gives a range of files to annotate by an annotator within a campaign"""

    objects = models.Manager.from_queryset(AnnotationFileRangeQuerySet)()

    class Meta:
        ordering = ["first_file_index"]
        # TODO: find a way to get this constraints back without crash the serializer
        #  unique_together = (
        #      (
        #          "first_file_index",
        #          "last_file_index",
        #          "annotation_campaign",
        #          "annotator",
        #      ),
        #  )

    def __str__(self):
        return (
            f"[Phase-{self.annotation_phase_id} | Annotator-{self.annotator_id}] "
            f"{self.first_file_index}-{self.last_file_index}"
        )

    first_file_index = models.PositiveIntegerField(validators=[MinValueValidator(0)])
    last_file_index = models.PositiveIntegerField(validators=[MinValueValidator(0)])

    from_datetime = models.DateTimeField()
    to_datetime = models.DateTimeField()

    files_count = models.PositiveIntegerField()
    annotator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="annotation_file_ranges",
    )
    annotation_phase = models.ForeignKey(
        "AnnotationPhase",
        on_delete=models.CASCADE,
        related_name="annotation_file_ranges",
    )

    def _check_finished_tasks(
        self, tasks: QuerySet[AnnotationTask], force: bool = False
    ):
        if force:
            return
        if tasks.filter(status=AnnotationTask.Status.FINISHED).exists():
            self.refresh_from_db()
            raise AnnotationTask.CannotDeleteFinished()

    def save(self, force: bool = False, **kwargs):
        # pylint: disable=no-member

        self.files_count = self.last_file_index - self.first_file_index + 1

        files = self.annotation_phase.annotation_campaign.spectrograms
        initial_tasks = AnnotationTask.objects.none()
        if self.from_datetime and self.to_datetime:
            initial_tasks = self.tasks

        from_datetime = files[self.first_file_index].start
        to_datetime = files[self.last_file_index].end
        if from_datetime > to_datetime:
            self.from_datetime, self.to_datetime = to_datetime, from_datetime
        else:
            self.from_datetime, self.to_datetime = from_datetime, to_datetime
        final_tasks = self.tasks

        removed_tasks: QuerySet[AnnotationTask] = initial_tasks.filter(
            ~Q(id__in=final_tasks.values_list("id", flat=True))
        )
        self._check_finished_tasks(removed_tasks, force)

        super().save(**kwargs)

    def delete(self, force: bool = False, using=None, keep_parents=False):
        self._check_finished_tasks(self.tasks, force)

        return super().delete(using, keep_parents)

    @property
    def tasks(self) -> QuerySet[AnnotationTask]:
        """Get file range tasks"""
        return AnnotationTask.objects.filter(
            annotation_phase_id=self.annotation_phase_id,
            annotator_id=self.annotator_id,
            spectrogram__start__gte=self.from_datetime,
            spectrogram__end__lte=self.to_datetime,
        )

    @property
    def spectrograms(self) -> QuerySet[Spectrogram]:
        """Get file range spectrograms"""
        return Spectrogram.objects.filter(
            analysis__annotation_campaigns__id=self.annotation_phase.annotation_campaign_id,
            start__gte=self.from_datetime,
            end__lte=self.to_datetime,
        ).distinct()

    # TODO:
    #  def _get_tasks(self) -> QuerySet[AnnotationTask]:
    #      return self.tasks.annotate(
    #          other_range_exist=Exists(
    #              Subquery(
    #                  AnnotationFileRange.objects.filter(
    #                      ~Q(id=self.id)
    #                      & Q(
    #                          annotator_id=self.annotator_id,
    #                          annotation_phase=self.annotation_phase,
    #                          from_datetime__lte=OuterRef("spectrogram__start"),
    #                          to_datetime__gte=OuterRef("spectrogram__end"),
    #                      )
    #                  )
    #              )
    #          )
    #      )

    def get_connected_ranges(self) -> QuerySet["AnnotationFileRange"]:
        """Recover connected ranges"""
        return (
            AnnotationFileRange.objects.filter(
                annotator_id=self.annotator,
                annotation_phase_id=self.annotation_phase_id,
            )
            .exclude(id=self.id)
            .filter(
                # A |-------|
                # B   |--|
                Q(
                    first_file_index__lte=self.first_file_index,
                    last_file_index__gte=self.last_file_index,
                )
                # A   |--|
                # B |-------|
                | Q(
                    first_file_index__gte=self.first_file_index,
                    last_file_index__lte=self.last_file_index,
                )
                # A |----|
                # B   |-----|
                | Q(
                    first_file_index__lte=self.first_file_index,
                    last_file_index__gte=self.first_file_index,
                    last_file_index__lte=self.last_file_index,
                )
                # A   |-----|
                # B |----|
                | Q(
                    first_file_index__gte=self.first_file_index,
                    first_file_index__lte=self.last_file_index,
                    last_file_index__gte=self.last_file_index,
                )
                # get siblings
                | Q(first_file_index=self.last_file_index + 1)
                | Q(last_file_index=self.first_file_index - 1)
            )
        )

    def clean_connected_ranges(self):
        """Clean connected ranges to limit the number of different items"""
        connected_ranges = self.get_connected_ranges()
        if not connected_ranges.exists():
            return

        # update connected
        min_first_index = min(
            connected_ranges.order_by("first_file_index").first().first_file_index,
            self.first_file_index,
        )
        max_last_index = max(
            connected_ranges.order_by("-last_file_index").first().last_file_index,
            self.last_file_index,
        )
        kept_instance = connected_ranges.order_by("id").first()
        duplicates = AnnotationFileRange.objects.filter(
            annotator_id=kept_instance.annotator_id,
            annotation_phase_id=kept_instance.annotation_phase_id,
            first_file_index=min_first_index,
            last_file_index=max_last_index,
        )
        if duplicates.exists():
            kept_instance = duplicates.first()
        else:
            kept_instance.first_file_index = min_first_index
            kept_instance.last_file_index = max_last_index
        kept_instance.get_connected_ranges().delete()
        kept_instance.save()

    @staticmethod
    def get_finished_task_count_query() -> Subquery:
        """Avoid duplicated code"""
        return Subquery(
            AnnotationTask.objects.filter(
                annotator_id=OuterRef("annotator_id"),
                annotation_phase_id=OuterRef("annotation_phase_id"),
                spectrogram__start__gte=OuterRef("from_datetime"),
                spectrogram__end__lte=OuterRef("to_datetime"),
                status=AnnotationTask.Status.FINISHED,
            )
            .annotate(count=Func(F("id"), function="Count"))
            .values("count")
        )


def clean_orphan_tasks():
    """Clean all tasks not related to a file range"""
    AnnotationTask.objects.filter(
        ~Exists(
            Subquery(
                AnnotationFileRange.objects.filter(
                    annotator_id=OuterRef("annotator_id"),
                    annotation_phase_id=OuterRef("annotation_phase_id"),
                    from_datetime__lte=OuterRef("spectrogram__start"),
                    to_datetime__gte=OuterRef("spectrogram__end"),
                )
            )
        )
    ).delete()


@receiver(signal=signals.post_save, sender=AnnotationFileRange)
def after_save(**kwargs):
    """After file range saved"""
    kwargs.get("instance").clean_connected_ranges()
    clean_orphan_tasks()


@receiver(signal=signals.post_delete, sender=AnnotationFileRange)
def after_delete(**kwargs):
    """After file range deleted"""
    clean_orphan_tasks()
