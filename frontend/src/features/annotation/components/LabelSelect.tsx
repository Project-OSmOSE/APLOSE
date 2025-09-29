import React, { Fragment, useCallback, useMemo } from "react";
import { Select } from "@/components/form";
import { AnnotationAPI } from '../api'
import { GetLabelsQueryVariables } from "../api/annotation.generated.ts";

export const LabelSelect: React.FC<{
  placeholder: string;
  selected?: string;
  onSelected: (label?: string) => void;
  filter?: GetLabelsQueryVariables
}> = ({ placeholder, selected, onSelected, filter }) => {
  const { data, isFetching } = AnnotationAPI.endpoints.getLabels.useQuery(filter)
  const labelItems = useMemo(() => data?.allAnnotationLabels?.results.filter(r => r !== null).map(l => ({
    label: l.name,
    value: l.name
  })) ?? [], [ data ])

  const setLabel = useCallback((label: number | string | undefined) => {
    onSelected(typeof label === 'number' ? undefined : label)
  }, [ onSelected ])

  if (!labelItems) return <Fragment/>
  return <Select label='Label' placeholder={ placeholder } optionsContainer='popover'
                 options={ labelItems }
                 value={ selected }
                 isLoading={ isFetching }
                 onValueSelected={ setLabel }/>
}