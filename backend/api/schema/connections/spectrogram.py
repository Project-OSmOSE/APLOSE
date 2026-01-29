import graphene
from django.db.models import Min, Max
from django_extension.schema.fields import AuthenticatedPaginationConnectionField
from graphene_django_pagination import PaginationConnection


class SpectrogramConnection(AuthenticatedPaginationConnectionField):
    @property
    def type(self):
        class NodeConnection(PaginationConnection):
            class Meta:
                node = self._type
                name = f"{self._type._meta.name}NodeConnection"

            total_count = graphene.NonNull(graphene.Int)

            def resolve_total_count(self, info, **kwargs):
                return self.iterable.count()

            start = graphene.DateTime()

            def resolve_start(self, info, **kwargs):
                return self.iterable.aggregate(start=Min("start"))["start"]

            end = graphene.DateTime()

            def resolve_end(self, info, **kwargs):
                return self.iterable.aggregate(end=Max("end"))["end"]

        return NodeConnection
