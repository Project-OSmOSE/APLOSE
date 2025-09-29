import { createSelector } from "@reduxjs/toolkit";
import { AppState } from "@/service/app.ts";
import { AnnotationDisplayState } from "./AnnotationSlice.ts";


export const selectCampaignFilters = createSelector(
  (state: AppState) => state.AnnotationDisplaySlice,
  (state: AnnotationDisplayState) => state.campaignFilters,
)
