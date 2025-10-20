import React, { useEffect } from 'react';
import { Head } from '@/components/ui';
import { IonSkeletonText } from '@ionic/react';
import { useCurrentCampaign } from '@/api';
import { useNavParams } from '@/features/UX';
import {
  DetectorConfigurationsFormBloc,
  DetectorsFormBloc,
  ImportAnnotationsContextProvider,
  ImportAnnotationsFormBloc,
  Upload,
  useImportAnnotationsContext,
} from '@/features/ImportAnnotations';

export const ImportAnnotations: React.FC = () => {
  const { campaign } = useCurrentCampaign();
  const { phaseType } = useNavParams()
  const { reset } = useImportAnnotationsContext()

  useEffect(() => {
    reset()
  }, []);

  return <ImportAnnotationsContextProvider>
    {/*className={ [ styles.page, styles[file.state], detectors.selection.length > 0 ? styles.withConfig : '' ].join(' ') }>*/ }

    <Head title="Import annotations"
          subtitle={ campaign ? `${ campaign.name } - ${ phaseType }` :
            <IonSkeletonText animated style={ { width: 128 } }/> }/>

    <ImportAnnotationsFormBloc/>
    <DetectorsFormBloc/>
    <DetectorConfigurationsFormBloc/>
    <Upload/>


  </ImportAnnotationsContextProvider>
}