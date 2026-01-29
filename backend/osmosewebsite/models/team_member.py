"""OSmOSE Website API Models - TeamMembers"""
from django.db import models
from django_extension.models import ExtendedEnum
from metadatax.common.models import Person


class TeamMember(models.Model):
    """TeamMember model"""

    class Type(ExtendedEnum):
        """Bibliography publication status"""

        ACTIVE = ("A", "Active")
        FORMER = ("F", "Former")
        COLLABORATOR = ("C", "Collaborator")

    level = models.IntegerField("Sorting level", blank=True, null=True)
    type = models.CharField(choices=Type.choices, max_length=1, default=Type.ACTIVE)

    person = models.OneToOneField(
        to=Person,
        on_delete=models.RESTRICT,
        related_name="team_member",
    )
    position = models.CharField(max_length=255)

    biography = models.TextField(blank=True, null=True)
    picture = models.URLField()

    mail_address = models.EmailField("Mail address", blank=True, null=True)
    research_gate_url = models.URLField("Research Gate URL", blank=True, null=True)
    personal_website_url = models.URLField(
        "Personal website URL", blank=True, null=True
    )
    github_url = models.URLField("Github URL", blank=True, null=True)
    linkedin_url = models.URLField("LinkedIn URL", blank=True, null=True)

    class Meta:
        ordering = ["level"]

    def __str__(self):
        return self.person.__str__()
