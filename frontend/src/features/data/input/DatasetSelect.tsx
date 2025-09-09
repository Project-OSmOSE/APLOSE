import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { IonSpinner } from "@ionic/react";

import { getErrorMessage } from "@/service/function.ts";
import { WarningText } from "@/components/ui";
import { ChipsInput, Select } from "@/components/form";

import { ImportAnalysisModalButton, ImportDatasetModalButton } from "@/features/data/import";
import { InputDataAPI } from "./api";

type Error = { [key in 'dataset' | 'analysis']?: string }

export const DatasetSelect: React.FC<{
  errors: Error,
  clearError: (error: keyof Error) => void,
  onDatasetSelected: (pk?: number) => void,
  selectAnalysis?: true,
  onAnalysisSelected?: (selection: number[]) => void,
  onAnalysisColormapsChanged?: (colormaps: string[]) => void
}> = ({ errors, clearError, onDatasetSelected, selectAnalysis, onAnalysisSelected, onAnalysisColormapsChanged }) => {
  const { data, isFetching, error } = InputDataAPI.endpoints.getDatasetsAndAnalysis.useQuery()

  const datasetOptions = useMemo(() => {
    return data?.allDatasets?.results.filter(r => r !== null).map(d => ({
      value: d.pk,
      label: d.name
    })) ?? []
  }, [ data ])

  const [ selectedDatasetID, setSelectedDatasetID ] = useState<number | undefined>();

  const analysisItems = useMemo(() => {
    return data?.allDatasets?.results.find(d => d?.pk === selectedDatasetID)
      ?.spectrogramAnalysis?.results.filter(r => r !== null).map(a => ({
        value: a.pk,
        label: a.name
      })) ?? []
  }, [ data, selectedDatasetID ])
  const [ selectedAnalysis, setSelectedAnalysis ] = useState<number[]>([]);

  const updateAnalysisSelection = useCallback((selection: Array<number>) => {
    setSelectedAnalysis(selection)
    if (onAnalysisSelected) onAnalysisSelected(selection)
    clearError('analysis')
  }, [ setSelectedAnalysis, onAnalysisSelected, clearError ]);

  const selectDataset = useCallback((value?: number) => {
    setSelectedDatasetID(value);
    onDatasetSelected(value);
    updateAnalysisSelection(data?.allDatasets?.results.find(d => d?.pk == value)?.spectrogramAnalysis?.results.filter(a => a !== null).map(a => a.pk) ?? [])
    clearError('dataset')
  }, [ setSelectedDatasetID, clearError, updateAnalysisSelection ]);

  useEffect(() => {
    if (!onAnalysisColormapsChanged) return;
    onAnalysisColormapsChanged(
      data?.allDatasets?.results.find(d => d?.pk === selectedDatasetID)
        ?.spectrogramAnalysis?.results.filter(a => a !== null)
        .filter(a => selectedAnalysis.includes(a.pk))
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
      <ImportDatasetModalButton/>
    </WarningText>

  return <Fragment>
    <Select label="Dataset"
            placeholder="Select a dataset"
            error={ errors.dataset }
            options={ datasetOptions }
            optionsContainer="alert"
            value={ selectedDatasetID }
            onValueSelected={ value => typeof value === 'number' ? selectDataset(value) : selectDataset(undefined) }
            required={ true }/>

    { selectAnalysis && <Fragment>
        <ChipsInput label="Analysis"
                    error={ errors.analysis }
                    disabled={ analysisItems.length === 0 }
                    items={ analysisItems }
                    activeItemsValues={ selectedAnalysis }
                    setActiveItemsValues={ items => updateAnalysisSelection(items.map(i => typeof (i) === 'number' ? i : +i)) }
                    required={ true }/>

      { selectedDatasetID && analysisItems.length === 0 && <WarningText>
          This dataset doesn't contain any analysis
          <ImportAnalysisModalButton/>
      </WarningText> }
    </Fragment> }
  </Fragment>
}
