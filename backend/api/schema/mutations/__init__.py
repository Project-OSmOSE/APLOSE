"""API GQL queries"""
from .archive_annotation_campaign import AnnotationCampaignArchiveMutation
from .create_annotation_campaign import CreateAnnotationCampaignMutation
from .create_annotation_phase import CreateAnnotationPhase
from .archive_annotation_phase import AnnotationCampaignPhaseMutation
from .dataset import (
    DatasetArchiveMutation,
)
from .file_range import (
    AnnotationFileRangeCreateMutation,
    AnnotationFileRangeUpdateMutation,
    AnnotationFileRangeDeleteMutation,
)
from .submit_annotation_task import SubmitAnnotationTaskMutation
from .update_annotation_campaign import UpdateAnnotationCampaignMutation
from .update_annotation_comments import UpdateAnnotationCommentsMutation
from .update_annotations import UpdateAnnotationsMutation
