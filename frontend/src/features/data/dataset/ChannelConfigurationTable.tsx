import React, { Fragment } from "react";
import styles from './styles.module.scss'
import { IonNote, IonSpinner } from "@ionic/react";
import { getErrorMessage } from "@/service/function.ts";
import { FadedText, Table, TableContent, TableDivider, TableHead, WarningText } from "@/components/ui";
import { DatasetAPI } from "./api";

export const DatasetChannelConfigurationTable: React.FC<{ id?: string }> = ({ id }) => {

  const {
    data: configurations,
    isLoading,
    error,
    isFetching
  } = DatasetAPI.endpoints.getDatasetChannelConfigurationsByID.useQuery({ id: id ?? '' }, { skip: !id });

  if (isLoading) return <IonSpinner/>
  if (error) <WarningText>{ getErrorMessage(error) }</WarningText>
  if (!configurations || configurations.length === 0) return <IonNote color='medium'>No acquisition
    information</IonNote>

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
