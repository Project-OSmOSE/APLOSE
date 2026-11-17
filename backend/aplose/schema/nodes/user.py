"""User GraphQL definitions"""
import graphene
from django.db.models import (
    QuerySet,
    F,
    Value,
    CharField,
    Case,
    When,
    Q,
    BooleanField,
    TextField,
)
from django.db.models.functions import Concat
from django_extension.schema.types import ExtendedNode
from graphene import (
    String,
    Boolean,
)
from graphql import GraphQLResolveInfo
from metadatax.ontology.models import LabelDisplay
from metadatax.ontology.schema import LabelDisplayEnum

from backend.aplose.models import User
from ..enums import ExpertiseLevelType


class UserNode(ExtendedNode):
    """User node"""

    class Meta:
        model = User
        exclude = ("password",)
        filter_fields = {}

    expertise = ExpertiseLevelType()
    label_display = graphene.NonNull(LabelDisplayEnum)
    display_name = String(required=True)
    is_admin = Boolean(required=True)

    @classmethod
    def resolve_queryset(cls, queryset: QuerySet, info: GraphQLResolveInfo):
        return (
            super()
            .resolve_queryset(queryset, info)
            .annotate(
                expertise=F("aplose__expertise_level"),
                label_display=Case(
                    When(aplose__isnull=False, then=F("aplose__label_display")),
                    default=Value(LabelDisplay.ENGLISH.value),
                    output_field=TextField(),
                ),
                is_admin=Case(
                    When(is_superuser=True, then=True),
                    When(is_staff=True, then=True),
                    default=Value(False),
                    output_field=BooleanField(),
                ),
                display_name=Case(
                    When(
                        ~Q(
                            first_name="",
                            last_name="",
                        ),
                        then=Concat(
                            F("first_name"),
                            Value(" "),
                            F("last_name"),
                            output_field=CharField(),
                        ),
                    ),
                    default=F("username"),
                    output_field=CharField(),
                ),
            )
        )
