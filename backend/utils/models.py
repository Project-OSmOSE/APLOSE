from django.db.models import TextChoices


class Enum(TextChoices):
    """Enum model field"""

    @classmethod
    def from_label(cls, label: str):
        """Get enum from label"""
        return cls.values[cls.labels.index(label)]
