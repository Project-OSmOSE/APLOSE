"""Annotation spectrogram connections"""
import graphene
from django.db.models import Q, Exists, OuterRef
from dulwich.porcelain import status
from graphene_django_pagination import PaginationConnection
from graphql import GraphQLResolveInfo

from backend.api.models import Spectrogram, AnnotationTask
from backend.api.schema.enums import AnnotationPhaseType
from backend.utils.schema import AuthenticatedDjangoConnectionField


class AnnotationSpectrogramConnectionField(AuthenticatedDjangoConnectionField):
    """Annotation spectrogram connection field"""

    @property
    def type(self):
        class NodeConnection(PaginationConnection):
            """Annotation spectrogram node connection"""

            total_count = graphene.NonNull(graphene.Int)
            resume_spectrogram_id = graphene.ID(
                campaign_id=graphene.ID(required=True),
                phase=AnnotationPhaseType(required=True),
            )
            previous_spectrogram_id = graphene.ID(spectrogram_id=graphene.ID())
            next_spectrogram_id = graphene.ID(spectrogram_id=graphene.ID())
            current_index = graphene.Int(spectrogram_id=graphene.ID())

            class Meta:
                node = self._type
                name = f"{self._type._meta.name}NodeConnection"

            def resolve_total_count(self, info, **kwargs):
                """Get spectrograms count"""
                # pylint: disable=no-member
                return self.iterable.distinct().count()

            def resolve_resume_spectrogram_id(
                self,
                info: GraphQLResolveInfo,
                campaign_id: int,
                phase: AnnotationPhaseType,
            ):
                """Get spectrograms resume id"""
                # pylint: disable=no-member
                resume = self.iterable.filter(
                    ~Exists(
                        AnnotationTask.objects.filter(
                            spectrogram_id=OuterRef("id"),
                            annotator_id=info.context.user.id,
                            annotation_phase__annotation_campaign_id=campaign_id,
                            annotation_phase__phase=phase.value,
                            status=AnnotationTask.Status.FINISHED,
                        )
                    )
                ).first()
                return resume.id if resume else None

            def resolve_previous_spectrogram_id(
                self, info, spectrogram_id: int, **kwargs
            ):
                """Get previous spectrogram id"""
                # pylint: disable=no-member
                current_spectrogram = Spectrogram.objects.get(pk=spectrogram_id)

                previous: Spectrogram = self.iterable.filter(
                    Q(start__lt=current_spectrogram.start)
                    | Q(start=current_spectrogram.start, id__lt=current_spectrogram.id)
                ).last()
                return previous.id if previous else None

            def resolve_next_spectrogram_id(self, info, spectrogram_id: int, **kwargs):
                current_spectrogram = Spectrogram.objects.get(pk=spectrogram_id)

                next: Spectrogram = self.iterable.filter(
                    Q(start__gt=current_spectrogram.start)
                    | Q(start=current_spectrogram.start, id__gt=current_spectrogram.id)
                ).first()
                return next.id if next else None

            def resolve_current_index(self, info, spectrogram_id: int):
                current_spectrogram = Spectrogram.objects.get(pk=spectrogram_id)
                return self.iterable.filter(
                    Q(start__lt=current_spectrogram.start)
                    | Q(start=current_spectrogram.start, id__lt=current_spectrogram.id)
                ).count()

        return NodeConnection
