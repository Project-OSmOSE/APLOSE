"""OSmOSE Website - Team Member"""
from django.contrib import admin
from django_extension.admin import ExtendedModelAdmin

from backend.osmosewebsite.models import TeamMember


@admin.register(TeamMember)
class TeamMemberAdmin(ExtendedModelAdmin):
    """TeamMember presentation in DjangoAdmin"""

    list_display = [
        "__str__",
        "show_institutions",
        "position",
        "type",
        "level",
    ]
    list_filter = ["type"]
    search_fields = ["person__first_name", "person__last_name"]
    fieldsets = [
        (
            None,
            {
                "fields": [
                    "person",
                    "type",
                    "position",
                    "picture",
                    "biography",
                    "level",
                ]
            },
        ),
        (
            "Email & Links",
            {
                "fields": [
                    "mail_address",
                    "personal_website_url",
                    "research_gate_url",
                    "github_url",
                    "linkedin_url",
                ]
            },
        ),
    ]

    @admin.display(description="Institutions")
    def show_institutions(self, obj: TeamMember):
        """show_spectro_configs"""
        return self.list_queryset(
            obj.person.institution_relations.all(),
            to_str=lambda rel: f"{rel.institution} ({rel.team.name})"
            if rel.team
            else str(rel.institution),
        )
