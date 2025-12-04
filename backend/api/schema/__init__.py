"""API GraphQL schemas"""
import graphene

from .queries import (
    AllSpectrogramAnalysisField,
    AllAnalysisForImportField,
    AllDatasetForImportField,
    AllDatasetField,
    DatasetByIdField,
    AllLabelSetField,
    AllDetectorsField,
    AllConfidenceSetField,
    AllAnnotationFileRangesField,
    AllAnnotationSpectrogramsField,
    AnnotationSpectrogramByIdField,
    AllAnnotationCampaignsField,
    AnnotationCampaignByIdField,
    AllAnnotationPhaseField,
    AnnotationPhaseByCampaignPhase,
    AnnotationLabelsForDeploymentIdField,
)
from .mutations import (
    ImportAnalysisMutation,
    ImportDatasetMutation,
    CreateAnnotationCampaignMutation,
    UpdateAnnotationCampaignMutation,
    UpdateAnnotationPhaseFileRangesMutation,
    EndAnnotationPhaseMutation,
    CreateAnnotationPhase,
    ArchiveAnnotationCampaignMutation,
    UpdateAnnotationCommentsMutation,
    UpdateAnnotationsMutation,
    SubmitAnnotationTaskMutation,
)


class APIMutation(graphene.ObjectType):
    """API GraphQL mutations"""

    # Dataset
    import_dataset = ImportDatasetMutation.Field()

    # Spectrogram analysis
    import_spectrogram_analysis = ImportAnalysisMutation.Field()

    # Annotation campaign
    create_annotation_campaign = CreateAnnotationCampaignMutation.Field()
    update_annotation_campaign = UpdateAnnotationCampaignMutation.Field()
    archive_annotation_campaign = ArchiveAnnotationCampaignMutation.Field()

    # Annotation phase
    create_annotation_phase = CreateAnnotationPhase.Field()
    update_annotation_phase_file_ranges = (
        UpdateAnnotationPhaseFileRangesMutation.Field()
    )
    end_annotation_phase = EndAnnotationPhaseMutation.Field()

    # Annotation
    update_annotations = UpdateAnnotationsMutation.Field()
    update_annotation_comments = UpdateAnnotationCommentsMutation.Field()
    submit_annotation_task = SubmitAnnotationTaskMutation.Field()


class APIQuery(graphene.ObjectType):
    """API GraphQL queries"""

    # Dataset
    all_datasets_for_import = AllDatasetForImportField
    all_datasets = AllDatasetField
    dataset_by_id = DatasetByIdField

    # Spectrogram analysis
    all_spectrogram_analysis = AllSpectrogramAnalysisField
    all_analysis_for_import = AllAnalysisForImportField

    # Label
    all_label_sets = AllLabelSetField
    annotation_labels_for_deployment_id = AnnotationLabelsForDeploymentIdField

    # Confidence
    all_confidence_sets = AllConfidenceSetField

    # Detector
    all_detectors = AllDetectorsField

    # Annotation campaign
    all_annotation_campaigns = AllAnnotationCampaignsField
    annotation_campaign_by_id = AnnotationCampaignByIdField
    all_annotation_phases = AllAnnotationPhaseField
    annotation_phase_by_campaign_phase = AnnotationPhaseByCampaignPhase

    # Annotation related items
    all_annotation_file_ranges = AllAnnotationFileRangesField
    all_annotation_spectrograms = AllAnnotationSpectrogramsField
    annotation_spectrogram_by_id = AnnotationSpectrogramByIdField
