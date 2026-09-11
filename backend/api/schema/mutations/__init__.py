"""API GQL queries"""
from .archive_annotation_campaign import ArchiveAnnotationCampaignMutation
from .create_annotation_campaign import CreateAnnotationCampaignMutation
from .create_annotation_phase import CreateAnnotationPhase
from .end_annotation_phase import EndAnnotationPhaseMutation
from .file_range import (
    AnnotationFileRangeCreateMutation,
    AnnotationFileRangeUpdateMutation,
    AnnotationFileRangeDeleteMutation,
)
from .submit_annotation_task import SubmitAnnotationTaskMutation
from .update_annotation_campaign import UpdateAnnotationCampaignMutation
from .update_annotation_comments import UpdateAnnotationCommentsMutation
from .update_annotation_phase_file_ranges import UpdateAnnotationPhaseFileRangesMutation
from .update_annotations import UpdateAnnotationsMutation
