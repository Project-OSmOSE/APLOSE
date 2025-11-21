import graphene
from graphene_django_pagination import DjangoPaginationConnectionField

from backend.api.models import Label, Dataset
from backend.api.schema.nodes import AnnotationLabelNode


def resolve_labels(root, info, deployment_id: int):
    return Label.objects.filter(
        annotation__annotation_phase__annotation_campaign__dataset__related_channel_configurations__deployment_id=deployment_id
    ).distinct()


AnnotationLabelsForDeploymentIdField = DjangoPaginationConnectionField(
    AnnotationLabelNode,
    deployment_id=graphene.ID(required=True),
    resolver=resolve_labels,
)
