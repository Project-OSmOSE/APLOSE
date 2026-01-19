"""File range model"""
from django.conf import settings
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from django.db import models
from django.db.models import Exists, Subquery, OuterRef, signals, Func, F, Q, QuerySet
from django.dispatch import receiver

from backend.utils.managers import CustomManager, CustomQuerySet
from .annotation_task import AnnotationTask
from ..data import Spectrogram


class AnnotationFileRangeQuerySet(CustomQuerySet):
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

    def save(self, *args, **kwargs):
        # pylint: disable=no-member

        self.files_count = self.last_file_index - self.first_file_index + 1

        files = self.annotation_phase.annotation_campaign.spectrograms

        from_datetime = files[self.first_file_index].start
        to_datetime = files[self.last_file_index].end
        if from_datetime > to_datetime:
            self.from_datetime, self.to_datetime = to_datetime, from_datetime
        else:
            self.from_datetime, self.to_datetime = from_datetime, to_datetime

        super().save(*args, **kwargs)

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

    @staticmethod
    def get_connected_ranges(data):
        """Recover connected ranges"""
        return (
            AnnotationFileRange.objects.filter(
                annotator_id=data.annotator,
                annotation_phase_id=data.annotation_phase,
            )
            .exclude(id=data.id)
            .filter(
                # get bigger
                Q(
                    first_file_index__lte=data.first_file_index,
                    last_file_index__gte=data.last_file_index,
                )
                # get littler
                | Q(
                    first_file_index__gte=data.first_file_index,
                    last_file_index__lte=data.last_file_index,
                )
                # get mixed
                | Q(
                    first_file_index__lte=data.first_file_index,
                    last_file_index__gte=data.first_file_index,
                    last_file_index__lte=data.last_file_index,
                )
                | Q(
                    first_file_index__gte=data.first_file_index,
                    first_file_index__lte=data.last_file_index,
                    last_file_index__gte=data.last_file_index,
                )
                # get siblings
                | Q(first_file_index=data.last_file_index + 1)
                | Q(last_file_index=data.first_file_index - 1)
            )
        )

    @staticmethod
    def clean_connected_ranges(data: list[dict]):
        """Clean connected ranges to limit the number of different items"""
        ids = [file_range["id"] for file_range in data]
        return_ids = []
        for range_id in ids:
            queryset = AnnotationFileRange.objects.filter(id=range_id)
            if not queryset.exists():
                continue
            item = queryset.first()
            connected_ranges = AnnotationFileRange.get_connected_ranges(item)
            if connected_ranges.exists():
                # update connected
                min_first_index = min(
                    connected_ranges.order_by("first_file_index")
                    .first()
                    .first_file_index,
                    item.first_file_index,
                )
                max_last_index = max(
                    connected_ranges.order_by("-last_file_index")
                    .first()
                    .last_file_index,
                    item.last_file_index,
                )
                instance = connected_ranges.order_by("id").first()
                duplicates = AnnotationFileRange.objects.filter(
                    annotator_id=instance.annotator_id,
                    annotation_phase_id=instance.annotation_phase_id,
                    first_file_index=min_first_index,
                    last_file_index=max_last_index,
                )
                if duplicates.exists():
                    instance = duplicates.first()
                else:
                    instance.first_file_index = min_first_index
                    instance.last_file_index = max_last_index
                    instance.save()
                return_ids.append(instance.id)
                connected_ranges.exclude(id=instance.id).delete()
        return AnnotationFileRange.objects.filter(id__in=return_ids)

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
    clean_orphan_tasks()


@receiver(signal=signals.post_delete, sender=AnnotationFileRange)
def after_delete(**kwargs):
    """After file range deleted"""
    clean_orphan_tasks()
