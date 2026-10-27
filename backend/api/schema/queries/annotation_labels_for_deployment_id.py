import graphene
from graphene_django_pagination import DjangoPaginationConnectionField
from metadatax.ontology.schema import LabelNode

from backend.api.models import Label


def resolve_labels(root, info, deployment_id: int):
    return Label.objects.filter(
        # pylint: disable=line-too-long
        annotation__annotation_phase__annotation_campaign__dataset__related_channel_configurations__deployment_id=deployment_id
    ).distinct()


AnnotationLabelsForDeploymentIdField = DjangoPaginationConnectionField(
    LabelNode,
    deployment_id=graphene.ID(required=True),
    resolver=resolve_labels,
)
