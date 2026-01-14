import type { AppState } from '@/features/App';
import { AnnotationCampaignGqlAPI } from './api'

export const selectCampaign = (state: AppState, id: string) =>
  AnnotationCampaignGqlAPI.endpoints.getCampaign.select({ id })(state)
