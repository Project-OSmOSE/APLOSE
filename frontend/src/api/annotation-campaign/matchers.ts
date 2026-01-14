import { AnnotationCampaignGqlAPI } from "./api";

const {
  getCampaign
} = AnnotationCampaignGqlAPI.endpoints

export const getCampaignFulfilled = getCampaign.matchFulfilled