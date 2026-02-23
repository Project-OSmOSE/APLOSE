import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { AnnotationCampaignGqlAPI } from '@/api/annotation-campaign/api';
import { StorageGqlAPI } from '@/api/storage/api';
import { gqlAPI } from '@/api/baseGqlApi';

export const resetStorageMiddleware = createListenerMiddleware()
resetStorageMiddleware.startListening({
    matcher: isAnyOf(
        AnnotationCampaignGqlAPI.endpoints.createCampaign.matchFulfilled,
        StorageGqlAPI.endpoints.importDatasetFromStorage.matchFulfilled,
        StorageGqlAPI.endpoints.importAnalysisFromStorage.matchFulfilled,
    ),
    effect: (_action, api) => {
        api.dispatch(gqlAPI.util.invalidateTags(['Folders']))
    },
})
