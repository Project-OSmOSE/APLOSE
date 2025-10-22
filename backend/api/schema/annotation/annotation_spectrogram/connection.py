import graphene
from django.db.models import Q
from graphene_django_pagination import PaginationConnection

from backend.api.models import Spectrogram
from backend.utils.schema import AuthenticatedDjangoConnectionField


class AnnotationSpectrogramConnectionField(AuthenticatedDjangoConnectionField):
    @property
    def type(self):
        class NodeConnection(PaginationConnection):
            total_count = graphene.Int()
            resume_spectrogram_id = graphene.ID()
            previous_spectrogram_id = graphene.ID(spectrogram_id=graphene.ID())
            next_spectrogram_id = graphene.ID(spectrogram_id=graphene.ID())
            current_index = graphene.Int(spectrogram_id=graphene.ID())

            class Meta:
                node = self._type
                name = "{}NodeConnection".format(self._type._meta.name)

            def resolve_total_count(self, info, **kwargs):
                return self.iterable.count()

            def resolve_resume_task_id(self, info, **kwargs):
                resume = self.iterable.filter(status="C").first()
                return resume.spectrogram_id if resume else None

            def resolve_previous_spectrogram_id(
                self, info, spectrogram_id: int, **kwargs
            ):
                current_spectrogram = Spectrogram.objects.get(pk=spectrogram_id)
                spectrograms = Spectrogram.objects.filter(
                    id__in=[task.spectrogram_id for task in self.iterable]
                )

                previous: Spectrogram = spectrograms.filter(
                    Q(start__lt=current_spectrogram.start)
                    | Q(start=current_spectrogram.start, id__lt=current_spectrogram.id)
                ).last()
                return previous.id if previous else None

            def resolve_next_spectrogram_id(self, info, spectrogram_id: int, **kwargs):
                current_spectrogram = Spectrogram.objects.get(pk=spectrogram_id)
                spectrograms = Spectrogram.objects.filter(
                    id__in=[task.spectrogram_id for task in self.iterable]
                )

                next: Spectrogram = spectrograms.filter(
                    Q(start__gt=current_spectrogram.start)
                    | Q(start=current_spectrogram.start, id__gt=current_spectrogram.id)
                ).first()
                return next.id if next else None

            def resolve_current_index(self, info, spectrogram_id: int):
                current_spectrogram = Spectrogram.objects.get(pk=spectrogram_id)
                spectrograms = Spectrogram.objects.filter(
                    id__in=[task.spectrogram_id for task in self.iterable]
                )
                return spectrograms.filter(
                    Q(start__lt=current_spectrogram.start)
                    | Q(start=current_spectrogram.start, id__lt=current_spectrogram.id)
                ).count()

        return NodeConnection
