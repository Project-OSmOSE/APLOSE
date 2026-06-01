import { QueryClient } from '@tanstack/react-query';

/**
 * Création du QueryClient avec configuration optimisée
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Temps de cache des données : 5 minutes
            staleTime: 5 * 60 * 1000,
            // Temps avant garbage collection : 10 minutes
            gcTime: 10 * 60 * 1000,
            // Nombre de tentatives en cas d'erreur
            retry: 1,
            // Délai avant nouvelle tentative
            retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Ne refetch pas au focus automatiquement en dev
            refetchOnWindowFocus: process.env.NODE_ENV === 'production',
            // Ne refetch pas lors de remontage
            refetchOnMount: false,
        },
        mutations: {
            // Les mutations sont critiques, pas de retry automatique
            retry: 0,
        },
    },
});
