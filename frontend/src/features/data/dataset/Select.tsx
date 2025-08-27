import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { DatasetAPI } from "@/features/data/dataset/api";
import { getErrorMessage } from "@/service/function.ts";
import { WarningText } from "@/components/ui";
import { IonSpinner } from "@ionic/react";
import { ImportDatasetButton } from "@/features/data/dataset/import";
import { ChipsInput, Select } from "@/components/form";
import { PostAnnotationCampaign } from "@/service/api/campaign.ts";
import { ID } from "@/service/type.ts";
import { ImportAnalysisButton } from "@/features/data/spectrogramAnalysis/import";

type Error = { [key in keyof Pick<PostAnnotationCampaign, 'dataset' | 'analysis'>]?: string }

export const DatasetSelect: React.FC<{
  errors: Error,
  clearError: (error: keyof Error) => void,
  onDatasetSelected: (id?: ID) => void,
  selectAnalysis?: true,
  onAnalysisSelected?: (selection: ID[]) => void,
  onAnalysisColormapsChanged?: (colormaps: string[]) => void
}> = ({ errors, clearError, onDatasetSelected, selectAnalysis, onAnalysisSelected, onAnalysisColormapsChanged }) => {
  const { data, isFetching, error } = DatasetAPI.endpoints.getDatasetsAndAnalysis.useQuery()
  const datasetOptions = useMemo(() => {
    return data?.allDatasets?.results.filter(r => r !== null).map(d => ({
      value: d.id,
      label: d.name
    })) ?? []
  }, [ data ])

  const [ selectedDatasetID, setSelectedDatasetID ] = useState<string | undefined>();
  const selectDataset = useCallback((value: string | number | undefined) => {
    setSelectedDatasetID(typeof value === 'number' ? value.toString() : value);
    onDatasetSelected(value);
    setSelectedAnalysis([])
    clearError('dataset')
  }, [ setSelectedDatasetID, clearError ]);

  const analysisItems = useMemo(() => {
    return data?.allDatasets?.results.find(d => d?.id === selectedDatasetID)
      ?.spectrogramAnalysis?.results.filter(r => r !== null).map(a => ({
        value: a.id,
        label: a.name
      })) ?? []
  }, [ data, selectedDatasetID ])
  const [ selectedAnalysis, setSelectedAnalysis ] = useState<ID[]>([]);
  const updateAnalysisSelection = useCallback((selection: Array<string | number>) => {
    setSelectedAnalysis(selection)
    if (onAnalysisSelected) onAnalysisSelected(selection)
    clearError('analysis')
  }, [ setSelectedAnalysis, onAnalysisSelected, clearError ]);
  useEffect(() => {
    if (!onAnalysisColormapsChanged) return;
    onAnalysisColormapsChanged(
      data?.allDatasets?.results.find(d => d?.id === selectedDatasetID)
        ?.spectrogramAnalysis?.results.filter(a => a !== null)
        .filter(a => selectedAnalysis.includes(a.id))
        .map(a => a.colormap.name) ?? []
    )
  }, [ selectedDatasetID, selectedAnalysis, ]);


  if (isFetching)
    return <IonSpinner/>
  if (error)
    return <WarningText>
      Fail loading datasets:
      { getErrorMessage(error) }
    </WarningText>
  if ((data?.allDatasets?.results ?? []).length === 0)
    return <WarningText>
      No datasets
      <ImportDatasetButton/>
    </WarningText>

  return <Fragment>
    <Select label="Dataset"
            placeholder="Select a dataset"
            error={ errors.dataset }
            options={ datasetOptions }
            optionsContainer="alert"
            value={ selectedDatasetID }
            onValueSelected={ selectDataset }
            required={ true }/>

    { selectAnalysis && <Fragment>
        <ChipsInput label="Analysis"
                    error={ errors.analysis }
                    disabled={ analysisItems.length === 0 }
                    items={ analysisItems }
                    activeItemsValues={ selectedAnalysis }
                    setActiveItemsValues={ updateAnalysisSelection }
                    required={ true }/>

      { selectedDatasetID && analysisItems.length === 0 && <WarningText>
          This dataset doesn't contain any analysis
          <ImportAnalysisButton/>
      </WarningText> }
    </Fragment> }
  </Fragment>
}