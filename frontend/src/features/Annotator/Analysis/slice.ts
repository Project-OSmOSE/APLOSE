import { createSlice } from '@reduxjs/toolkit';
import type { GetCampaignQueryVariables } from '@/api';
import { ColormapNode, getCampaignFulfilled, type GetCampaignQuery, SpectrogramAnalysisNode } from '@/api';

export type Analysis = Pick<SpectrogramAnalysisNode, 'id'> & {
  colormap: Pick<ColormapNode, 'name'>;
} | undefined

type AnalysisState = {
  id?: string;

  _campaignID?: string;
}

export function getDefaultAnalysisID({ data, id }: { data: GetCampaignQuery, id?: string }) {
  const allAnalysis = data?.annotationCampaignById?.analysis.edges.filter(e => !!e?.node).map(e => e!.node!)
  // Select default analysis when none existing is selected
  if (!allAnalysis || allAnalysis.length === 0 || allAnalysis.find(a => a.id === id)) return id;
  const baseScaleAnalysis = allAnalysis.find(a => !a!.legacyConfiguration?.scaleName);
  const minID = Math.min(...allAnalysis.map(a => +a!.id))?.toString();
  if (minID) return baseScaleAnalysis?.id ?? minID
  return id
}

export const AnnotatorAnalysisSlice = createSlice({
  name: 'AnnotatorAnalysis',
  initialState: {
    _campaignID: undefined,
  } as AnalysisState,
  reducers: {
    setAnalysis: (state, action: { payload: Analysis }) => {
      state.id = action.payload?.id
    },
  },
  extraReducers: builder => {
    builder.addMatcher(getCampaignFulfilled, (state: AnalysisState, action: {
      payload: GetCampaignQuery
      meta: { arg: { originalArgs: GetCampaignQueryVariables } }
    }) => {
      if (state._campaignID !== action.payload.annotationCampaignById?.id) {
        state._campaignID = action.payload.annotationCampaignById?.id
        state.id = getDefaultAnalysisID({ data: action.payload })
      } else {
        state.id = getDefaultAnalysisID({ data: action.payload, id: state.id })
      }
    })
  },
  selectors: {
    selectID: state => state.id,
  },
})

export const {
  setAnalysis,
} = AnnotatorAnalysisSlice.actions
