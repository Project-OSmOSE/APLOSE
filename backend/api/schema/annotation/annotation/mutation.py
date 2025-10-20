from backend.api.serializers.annotation import AnnotationSerializer
from backend.utils.schema.types import AuthenticatedSerializerMutation


class AnnotationMutation(AuthenticatedSerializerMutation):
    class Meta:
        serializer_class = AnnotationSerializer
        model_operations = ["create", "update"]
