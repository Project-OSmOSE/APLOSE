import { queryClient } from './queryClient';
import type { QueryKey } from '@tanstack/react-query';
import type { BrowseStorageQueryVariables, SearchStorageQueryVariables } from '@/features/Storage';
import type { GetDatasetByIdQueryVariables } from '@/features/Dataset';
import type { FileRangesForPhaseQueryVariables } from '@/features/AnnotationFileRange';
import type { AllCampaignsQueryVariables, GetCampaignQueryVariables } from '@/features/AnnotationCampaign';
import type { AllSpectrogramAnalysisQueryVariables } from '@/features/SpectrogramAnalysis';
import type { GetDetailedSoundByIdQueryVariables, GetDetailedSourceByIdQueryVariables } from '@/features/Ontology';
import type { GetAnnotationPhaseQueryVariables } from '@/features/AnnotationPhase';
import type {
    AllAnnotationSpectrogramsQueryVariables,
    GetAnnotationSpectrogramPathsQueryVariables,
    GetAnnotationSpectrogramQueryVariables,
} from '@/features/AnnotationSpectrogram';
import type { AnnotationPhaseType } from '@/api/types.gql-generated';

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
        byId: (variables: GetDatasetByIdQueryVariables) => [ 'dataset', variables.id ] as const,
        listWithAnalysis: [ 'dataset', 'analysis' ] as const,
    },
    analysis: {
        all: (variables: AllSpectrogramAnalysisQueryVariables) => [ 'analysis', variables ] as const,
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
};

/**
 * Interface standard pour les réponses paginées
 */
export interface PageInfo {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
}

/**
 * Invalide tous les caches pour une entité
 */
export function invalidateEntity(entityKey: QueryKey) {
    queryClient.invalidateQueries({ queryKey: entityKey });
}

/**
 * Invalide les caches liés en cascade
 * Exemple : créer un post invalide aussi la liste et l'utilisateur
 */
export function invalidateRelated(
    primaryKey: QueryKey,
    relatedKeys: QueryKey[],
) {
    queryClient.invalidateQueries({ queryKey: primaryKey });
    relatedKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
    });
}

/**
 * Mise à jour optimiste du cache
 * Utile pour les mutations sans refetch
 */
export function updateCache<T>(
    key: QueryKey,
    updater: (old: T) => T,
): void {
    const oldData = queryClient.getQueryData<T>(key);
    if (oldData) {
        queryClient.setQueryData<T>(key, updater(oldData));
    }
}

/**
 * Précharge une requête (useful pour les links au hover)
 */
export async function prefetchQuery<T>(
    key: QueryKey,
    queryFn: () => Promise<T>,
) {
    await queryClient.prefetchQuery({
        queryKey: key,
        queryFn,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

/**
 * Nettoie le cache complètement
 * Utile au logout
 */
export function clearCache() {
    queryClient.clear();
}