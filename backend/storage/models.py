from django_extension.models import ExtendedEnum


class ImportStatus(ExtendedEnum):
    UNAVAILABLE = ("U", "Unavailable")
    AVAILABLE = ("A", "Available")
    PARTIAL = ("P", "Partial")
    IMPORTED = ("I", "Imported")


__all__ = ["ImportStatus"]
