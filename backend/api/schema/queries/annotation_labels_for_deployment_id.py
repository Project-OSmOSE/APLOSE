from typing import Optional

import graphene
import graphene_django_optimizer
from django.db.models import Prefetch, Count
from django_extension.schema.types import ExtendedNode
from graphene_django_pagination import DjangoPaginationConnectionField
from metadatax.ontology.models import Label
from metadatax.ontology.schema import LabelNode

from backend.api.models import Annotation


class DeploymentLabelNode(graphene.ObjectType):
    label = graphene.NonNull(LabelNode)
    uses = graphene.Int(required=True)


def resolve_labels(root, info, deployment_id: int):
    return [
        {"label": label, "uses": label.uses}
        for label in (Label.objects.filter(
            # pylint: disable=line-too-long
            annotation__annotation_phase__annotation_campaign__dataset__related_channel_configurations__deployment_id=deployment_id
        )
        .distinct()
        .prefetch_related(
            Prefetch(
                "annotation_set",
                queryset=Annotation.objects.filter(
                    # pylint: disable=line-too-long
                    annotation_phase__annotation_campaign__dataset__related_channel_configurations__deployment_id=deployment_id
                ),
            )
        )
        .annotate(
            uses=Count('annotation'),
        )
            .order_by('-uses', 'pk')
        )
    ]


AnnotationLabelsForDeploymentIdField = graphene.List(
    DeploymentLabelNode,
    deployment_id=graphene.ID(required=True),
    resolver=resolve_labels,
)
