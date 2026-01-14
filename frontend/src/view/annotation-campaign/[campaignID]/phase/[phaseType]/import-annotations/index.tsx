import React, { useEffect, useMemo } from 'react';
import { Head } from '@/components/ui';
import { IonSkeletonText } from '@ionic/react';
import { useCurrentCampaign } from '@/api';
import { type AploseNavParams } from '@/features/UX';
import {
  DetectorConfigurationsFormBloc,
  DetectorsFormBloc,
  ImportAnnotationsContextProvider,
  ImportAnnotationsFormBloc,
  Upload,
  useImportAnnotationsContext,
} from '@/features/ImportAnnotations';
import styles from './styles.module.scss'
import { useParams } from 'react-router-dom';

export const ImportAnnotations: React.FC = () => {
  const { campaign } = useCurrentCampaign();
  const { phaseType } = useParams<AploseNavParams>();
  const {
    selectedDetectorsForImport,
    reset,
    fileState,
  } = useImportAnnotationsContext()

  const className = useMemo(() => {
    const classes = [ styles.page ]
    switch (fileState) {
      case 'initial':
        classes.push(styles.initial)
        break;
      case 'loaded':
        classes.push(styles.loaded)
        break;
    }
    if (selectedDetectorsForImport.length > 0) {
      classes.push(styles.withConfig)
    }
    return classes.join(' ')
  }, [ fileState, selectedDetectorsForImport ])

  useEffect(() => {
    reset()
  }, []);

  return <ImportAnnotationsContextProvider>

    <Head title="Import annotations"
          subtitle={ campaign ? `${ campaign.name } - ${ phaseType }` :
            <IonSkeletonText animated style={ { width: 128 } }/> }/>

    <div className={ className }>
      <ImportAnnotationsFormBloc/>
      <DetectorsFormBloc/>
      <DetectorConfigurationsFormBloc/>
      <Upload/>
    </div>


  </ImportAnnotationsContextProvider>
}

export default ImportAnnotations
