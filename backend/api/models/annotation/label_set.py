"""Label set model"""

from django.db import models
from metadatax.ontology.models import Label


class LabelSet(models.Model):
    """
    This table contains collections of labels to be used for dataset annotations.
    A label_set is created by a staff user and can be used for multiple annotation campaigns.
    """

    def __str__(self):
        return str(self.name)

    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(null=True, blank=True)
    labels = models.ManyToManyField(Label)
