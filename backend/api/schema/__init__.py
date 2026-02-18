"""API GraphQL schemas"""
import graphene
from django_extension.schema.fields import (
    ByIdField,
    AuthenticatedPaginationConnectionField,
)
from django_extension.schema.permissions import GraphQLPermissions

from .nodes import (
    AnnotationCampaignNode,
    AnnotationSpectrogramNode,
    DatasetNode,
    ConfidenceSetNode,
    LabelSetNode,
    AnnotationFileRangeNode,
    AnnotationPhaseNode,
    DetectorNode,
    SpectrogramAnalysisNode,
)
from .queries import (
    AllAnalysisForImportField,
    AllAnnotationSpectrogramsField,
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
    all_datasets = AuthenticatedPaginationConnectionField(DatasetNode)
    dataset_by_id = ByIdField(
        DatasetNode,
        permission=GraphQLPermissions.AUTHENTICATED,
    )

    # Spectrogram analysis
    all_spectrogram_analysis = AuthenticatedPaginationConnectionField(
        SpectrogramAnalysisNode
    )
    all_analysis_for_import = AllAnalysisForImportField

    # Label
    all_label_sets = AuthenticatedPaginationConnectionField(LabelSetNode)
    annotation_labels_for_deployment_id = AnnotationLabelsForDeploymentIdField

    # Confidence
    all_confidence_sets = AuthenticatedPaginationConnectionField(ConfidenceSetNode)

    # Detector
    all_detectors = AuthenticatedPaginationConnectionField(DetectorNode)

    # Annotation campaign
    all_annotation_campaigns = AuthenticatedPaginationConnectionField(
        AnnotationCampaignNode
    )
    annotation_campaign_by_id = ByIdField(
        AnnotationCampaignNode,
        permission=GraphQLPermissions.AUTHENTICATED,
    )
    all_annotation_phases = AuthenticatedPaginationConnectionField(AnnotationPhaseNode)
    annotation_phase_by_campaign_phase = AnnotationPhaseByCampaignPhase

    # Annotation related items
    all_annotation_file_ranges = AuthenticatedPaginationConnectionField(
        AnnotationFileRangeNode
    )
    all_annotation_spectrograms = AllAnnotationSpectrogramsField
    annotation_spectrogram_by_id = ByIdField(
        AnnotationSpectrogramNode,
        permission=GraphQLPermissions.AUTHENTICATED,
    )
