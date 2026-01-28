from django_extension.schema.types import ExtendedNode

from backend.osmosewebsite.models import News


class NewsNode(ExtendedNode):
    """News node"""

    class Meta:
        model = News
        fields = "__all__"
        filter_fields = ["id"]
