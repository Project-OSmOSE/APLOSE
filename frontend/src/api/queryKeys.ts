import { queryClient } from './queryClient';
import type { QueryKey } from '@tanstack/react-query';
import type { BrowseStorageQueryVariables, SearchStorageQueryVariables } from '@/features/Storage';
import type { GetDatasetByIdQueryVariables } from '@/features/Dataset';
import { ChannelConfigurationsForDatasetQueryVariables } from '@/features/ChannelConfiguration';
import type { FileRangesForPhaseQueryVariables } from '@/features/AnnotationFileRange';
import type { AllCampaignsQueryVariables } from '@/features/AnnotationCampaign';
import type { AllSpectrogramAnalysisQueryVariables } from '@/features/SpectrogramAnalysis';
import type { GetDetailedSoundByIdQueryVariables, GetDetailedSourceByIdQueryVariables } from '@/features/Ontology';

/**
 * Keys factory pour les requêtes GraphQL
 * Permet d'invalider les requêtes de manière prévisible
 */
export const queryKeys = {
    campaign: {
        all: (variables: AllCampaignsQueryVariables) => [ 'campaign', variables ] as const,
    },
    fileRange: {
        forPhase: (variables: FileRangesForPhaseQueryVariables) => [ 'file-range', 'for phase', variables.campaignID, variables.phaseType ] as const,
    },
    channelConfiguration: {
        forDataset: (variables: ChannelConfigurationsForDatasetQueryVariables) => [ 'channel-configuration', 'for dataset', variables.datasetID ] as const,
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