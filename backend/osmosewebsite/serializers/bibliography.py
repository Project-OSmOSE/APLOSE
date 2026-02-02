"""Bibliography serializers"""
from django_extension.serializers import EnumField
from metadatax.bibliography.models import (
    Bibliography,
    Author,
    BibliographyStatus,
    BibliographyType,
)
from metadatax.common.models import Person, Tag
from metadatax.common.serializers import PersonSerializer as MxPersonSerializer
from rest_framework import serializers

from .institution import InstitutionSerializer
from .team_member import TeamMemberSerializer


class PersonSerializer(MxPersonSerializer):
    """Contact serializer"""

    team_member = TeamMemberSerializer(read_only=True)

    class Meta:
        model = Person
        fields = "__all__"


class AuthorSerializer(serializers.ModelSerializer):
    """Serializer meant to output Author data"""

    contact = PersonSerializer(read_only=True)
    institutions = InstitutionSerializer(many=True, read_only=True)

    class Meta:
        model = Author
        exclude = ("bibliography",)


class BibliographySerializer(serializers.ModelSerializer):
    """Serializer meant to output Bibliography data"""

    tags = serializers.SlugRelatedField(
        queryset=Tag.objects.all(), many=True, slug_field="name"
    )
    status = EnumField(BibliographyStatus)
    type = EnumField(BibliographyType)

    authors = AuthorSerializer(many=True, read_only=True)

    class Meta:
        model = Bibliography
        fields = "__all__"
