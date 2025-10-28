import graphene
from django.db.models import Sum
from graphene_django_pagination import PaginationConnection

from backend.utils.schema import AuthenticatedDjangoConnectionField


class AnnotationFileRangeConnectionField(AuthenticatedDjangoConnectionField):
    @property
    def type(self):
        class NodeConnection(PaginationConnection):
            total_count = graphene.NonNull(graphene.Int)
            tasks_count = graphene.NonNull(graphene.Int)

            class Meta:
                node = self._type
                name = "{}NodeConnection".format(self._type._meta.name)

            def resolve_total_count(self, info, **kwargs):
                return self.iterable.count()

            def resolve_tasks_count(self, info, **kwargs):
                return self.iterable.aggregate(count=Sum("files_count"))["count"] or 0

        return NodeConnection
