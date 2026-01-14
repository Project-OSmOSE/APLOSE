from typing import Optional

import graphene
import graphene_django_optimizer

from backend.api.models import Label, Annotation
from backend.api.schema.filter_sets import LabelFilterSet
from backend.utils.schema.types import BaseObjectType, BaseNode


class AnnotationLabelNode(BaseObjectType):
    """Label schema"""

    class Meta:
        model = Label
        fields = "__all__"
        filterset_class = LabelFilterSet
        interfaces = (BaseNode,)

    uses = graphene.Int(required=True, deployment_id=graphene.ID())

    @graphene_django_optimizer.resolver_hints()
    def resolve_uses(self: Label, info, deployment_id: Optional[int]):
        queryset = Annotation.objects.filter(label=self)
        if deployment_id is not None:
            queryset = queryset.filter(
                # pylint: disable=line-too-long
                annotation_phase__annotation_campaign__dataset__related_channel_configurations__deployment_id=deployment_id
            )
        return queryset.count()
