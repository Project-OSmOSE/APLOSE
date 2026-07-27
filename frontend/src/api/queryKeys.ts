import type { BrowseStorageQueryVariables, SearchStorageQueryVariables } from '@/features/Storage/api';
import type { GetDatasetByIdQueryVariables } from '@/features/Dataset/api';
import type { FileRangesForPhaseQueryVariables } from '@/features/AnnotationFileRange/api';
import type { AllCampaignsQueryVariables, GetCampaignQueryVariables } from '@/features/AnnotationCampaign/api';
import type {
    AllSpectrogramAnalysisForDatasetQueryVariables,
    AllSpectrogramAnalysisQueryVariables,
} from '@/features/SpectrogramAnalysis/api';
import type { GetDetailedSoundByIdQueryVariables, GetDetailedSourceByIdQueryVariables } from '@/features/Ontology/api';
import type { GetAnnotationPhaseQueryVariables } from '@/features/AnnotationPhase/api';
import type {
    AllAnnotationSpectrogramsQueryVariables,
    GetAnnotationSpectrogramPathsQueryVariables,
    GetAnnotationSpectrogramQueryVariables,
} from '@/features/AnnotationSpectrogram/api';
import type { AnnotationPhaseType } from '@/api/types.gql-generated';
import type { AllDeploymentsQueryVariables } from '@/features/Mx/Acquisition/Deployment/all.generated';

/**
 * Keys factory pour les requêtes GraphQL
 * Permet d'invalider les requêtes de manière prévisible
 */
export const queryKeys = {
    campaign: {
        base: [ 'campaign' ],
        all: (variables: AllCampaignsQueryVariables) => [ 'campaign', variables ] as const,
        byId: (variables: GetCampaignQueryVariables) => [ 'campaign', variables.id ] as const,
    },
    phase: {
        get: ({ campaignID, phase }: GetAnnotationPhaseQueryVariables) => [ 'phase', campaignID, phase ] as const,
    },
    fileRange: {
        forPhase: (variables: FileRangesForPhaseQueryVariables) => [ 'file-range', 'for phase', variables.campaignID, variables.phaseType ] as const,
    },
    spectrogram: {
        base: [ 'spectrogram' ],
        baseForPhase: ({
                           campaignID,
                           phaseType,
                       }: {
            campaignID: string, phaseType: AnnotationPhaseType
        }) => [ 'spectrogram', campaignID, phaseType ] as const,
        all: ({
                  campaignID,
                  phaseType,
                  ...variables
              }: AllAnnotationSpectrogramsQueryVariables) => [ 'spectrogram', campaignID, phaseType, variables ] as const,
        get: ({
                  campaignID,
                  phaseType,
                  spectrogramID,
                  ...variables
              }: Pick<GetAnnotationSpectrogramQueryVariables, 'campaignID' | 'phaseType' | 'spectrogramID'>
            & Partial<Omit<GetAnnotationSpectrogramQueryVariables, 'campaignID' | 'phaseType' | 'spectrogramID'>>) =>
            [ 'spectrogram', campaignID, phaseType, spectrogramID, variables ] as const,
        getPath: ({
                      spectrogramID,
                      analysisID,
                  }: GetAnnotationSpectrogramPathsQueryVariables) => [ 'spectrogram', 'path', spectrogramID, analysisID ] as const,
    },
    dataset: {
        all: [ 'dataset' ] as const,
        allWithCampaigns: [ 'dataset', 'campaign' ] as const,
        byId: (variables: GetDatasetByIdQueryVariables) => [ 'dataset', variables.id ] as const,
        listWithAnalysis: [ 'dataset', 'analysis' ] as const,
    },
    analysis: {
        all: (variables: AllSpectrogramAnalysisQueryVariables) => [ 'analysis', variables ] as const,
        allForDataset: ({ datasetID }: AllSpectrogramAnalysisForDatasetQueryVariables) => [ 'analysis', 'dataset', datasetID ] as const,
    },
    ontology: {
        sound: {
            all: [ 'ontology', 'sound' ] as const,
            byId: (variables: GetDetailedSoundByIdQueryVariables) => [ 'ontology', 'sound', variables.id ] as const,
        },
        source: {
            all: [ 'ontology', 'source' ] as const,
            byId: (variables: GetDetailedSourceByIdQueryVariables) => [ 'ontology', 'source', variables.id ] as const,
        },
    },
    storage: {
        browse: (variables: BrowseStorageQueryVariables) => [ 'storage', 'browse', variables.path.split('/') ] as const,
        search: (variables: SearchStorageQueryVariables) => [ 'storage', 'search', variables.path.split('/') ] as const,
    },
    user: {
        all: [ 'user' ] as const,
        current: [ 'user', 'current' ] as const,
    },
    label: {
        allSets: [ 'label', 'set' ] as const,
    },
    confidence: {
        allSets: [ 'confidence', 'set' ] as const,
    },
    detector: {
        all: [ 'detector' ] as const,
    },
    mx: {
        acquisition: {
            project: {
                all: [ 'mx', 'acquisition', 'project' ] as const,
                allSelect: [ 'mx', 'acquisition', 'project', 'select' ] as const,
            },
            deployments: {
                all: ({ projectID }: AllDeploymentsQueryVariables) => [ 'mx', 'acquisition', 'deployment', 'timeline', projectID ] as const,
            },
        },
        common: {
            allInstitutions: [ 'mx', 'common', 'institution' ] as const,
            institutionTeams: (institutionID?: string | null) => [ 'mx', 'common', 'institution', institutionID, 'team' ] as const,
            allTeams: [ 'mx', 'common', 'team' ] as const,
            allPersons: [ 'mx', 'common', 'person' ] as const,
            contactTypes: [ 'mx', 'common', 'contact-type' ] as const,
        },
        equipment: {
            allPlatformTypes: [ 'mx', 'equipment', 'platform-type' ] as const,
            allPlatforms: [ 'mx', 'equipment', 'platform' ] as const,
            allEquipmentModels: [ 'mx', 'equipment', 'equipment-model' ] as const,
            allEquipments: [ 'mx', 'equipment', 'equipment' ] as const,
        },
        ontology: {
            allLabels: [ 'mx', 'ontology', 'label' ] as const,
            allSources: [ 'mx', 'ontology', 'source' ] as const,
        },
        data: {
            allFormats: ['mx', 'data', 'format'] as const,
        }
    },
};
