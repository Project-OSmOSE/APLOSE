import React, { Fragment, useMemo } from "react";
import { IonNote, IonSpinner } from "@ionic/react";

import { FadedText, Table, TableContent, TableDivider, TableHead, WarningText } from "@/components/ui";
import { getErrorMessage } from "@/service/function.ts";

import { AcquisitionDisplayAPI } from "./api";
import styles from './styles.module.scss'

export const ChannelConfigurationTable: React.FC<{ datasetPK: number }> = ({ datasetPK }) => {

  const {
    data,
    isLoading,
    error,
    isFetching
  } = AcquisitionDisplayAPI.endpoints.getChannelConfigurations.useQuery({ datasetPK });
  const configurations = useMemo(() => {
    return data?.allChannelConfigurations?.results.filter(r => r !== null) ?? []
  }, [ data ])

  if (isLoading) return <IonSpinner/>
  if (error) <WarningText>{ getErrorMessage(error) }</WarningText>
  if (!configurations || configurations.length === 0)
    return <IonNote color='medium'>No acquisition information</IonNote>

  return <Table columns={ 12 }>
    <TableHead topSticky isFirstColumn={ true }>
      Project
      { isFetching && <IonSpinner className={ styles.gridSpinner }/> }
    </TableHead>
    <TableHead topSticky>Deployment</TableHead>
    <TableHead topSticky>Site</TableHead>
    <TableHead topSticky>Campaign</TableHead>
    <TableHead topSticky>Recorder</TableHead>
    <TableHead topSticky>Hydrophone</TableHead>
    <TableHead topSticky>Detector</TableHead>
    <TableDivider/>

    { configurations.map((c, k) => <Fragment key={ k }>
      <TableContent isFirstColumn={ true }>{ c.deployment?.project?.name }</TableContent>
      <TableContent>{ c.deployment?.name }</TableContent>
      <TableContent>{ c.deployment?.site?.name }</TableContent>
      <TableContent>{ c.deployment?.campaign?.name }</TableContent>
      { c.recorderSpecification ? <Fragment>
        <TableContent>{ c.recorderSpecification?.recorder.model }
          <FadedText>#{ c.recorderSpecification?.recorder.serialNumber }</FadedText></TableContent>
        <TableContent>{ c.recorderSpecification?.hydrophone.model }
          <FadedText>#{ c.recorderSpecification?.hydrophone.serialNumber }</FadedText></TableContent>
      </Fragment> : <Fragment>
        <TableContent>-</TableContent>
        <TableContent>-</TableContent>
      </Fragment> }
      { c.detectorSpecification ? <TableContent>
        { c.detectorSpecification?.detector.model }
        <FadedText>#{ c.detectorSpecification?.detector.serialNumber }</FadedText>
      </TableContent> : <TableContent>-</TableContent> }
      <TableDivider/>
    </Fragment>) }
  </Table>
}
