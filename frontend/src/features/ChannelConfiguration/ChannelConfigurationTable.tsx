import React, { Fragment } from 'react';
import { IonNote, IonSpinner } from '@ionic/react';

import { FadedText, Table, TableContent, TableDivider, TableHead, WarningText } from '@/components/ui';
import { useAllChannelConfigurations } from '@/api';
import styles from './styles.module.scss'

export const ChannelConfigurationTable: React.FC<{ datasetID: string }> = ({ datasetID }) => {

  const {
    allChannelConfigurations,
    isLoading,
    error,
    isFetching,
  } = useAllChannelConfigurations({ datasetID });

  if (isLoading) return <IonSpinner/>
  if (error) return <WarningText error={ error }/>
  if (!allChannelConfigurations || allChannelConfigurations.length === 0)
    return <IonNote color="medium">No acquisition information</IonNote>

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

    { allChannelConfigurations.map((c, k) => <Fragment key={ k }>
      <TableContent isFirstColumn={ true }>{ c.deployment?.project?.name }</TableContent>
      <TableContent>{ c.deployment?.name }</TableContent>
      <TableContent>{ c.deployment?.site?.name }</TableContent>
      <TableContent>{ c.deployment?.campaign?.name }</TableContent>
      { c.recorderSpecification ? <Fragment>
        <TableContent>{ c.recorderSpecification?.recorder.model.name }
          <FadedText>#{ c.recorderSpecification?.recorder.serialNumber }</FadedText></TableContent>
        <TableContent>{ c.recorderSpecification?.hydrophone.model.name }
          <FadedText>#{ c.recorderSpecification?.hydrophone.serialNumber }</FadedText></TableContent>
      </Fragment> : <Fragment>
        <TableContent>-</TableContent>
        <TableContent>-</TableContent>
      </Fragment> }
      { c.detectorSpecification ? <TableContent>
        { c.detectorSpecification?.detector.model.name }
        <FadedText>#{ c.detectorSpecification?.detector.serialNumber }</FadedText>
      </TableContent> : <TableContent>-</TableContent> }
      <TableDivider/>
    </Fragment>) }
  </Table>
}
