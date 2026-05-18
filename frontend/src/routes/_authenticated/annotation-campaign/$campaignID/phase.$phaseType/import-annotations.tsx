import React, { useEffect, useMemo } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { IonSkeletonText } from '@ionic/react';

import { Head } from '@/components/ui';

import { AnnotationPhaseType, useCurrentCampaign } from '@/api';
import {
    DetectorConfigurationsFormBloc,
    DetectorsFormBloc,
    ImportAnnotationsContextProvider,
    ImportAnnotationsFormBloc,
    Upload,
    useImportAnnotationsContext,
} from '@/features/ImportAnnotations';

import styles from './import-annotations.module.scss';


const ImportAnnotations: React.FC = () => {
    const { campaign } = useCurrentCampaign();
    const { phaseType } = Route.useParams();
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

    return useMemo(() =>
            <ImportAnnotationsContextProvider>

                <Head title="Import annotations"
                      subtitle={ campaign ? `${ campaign.name } - ${ phaseType }` :
                          <IonSkeletonText animated style={ { width: 128 } }/> }/>

                <div className={ className }>
                    <ImportAnnotationsFormBloc/>
                    <DetectorsFormBloc/>
                    <DetectorConfigurationsFormBloc/>
                    <Upload/>
                </div>


            </ImportAnnotationsContextProvider>,
        [campaign, className, phaseType],
    )
}

export const Route = createFileRoute('/_authenticated/annotation-campaign/$campaignID/phase/$phaseType/import-annotations')({
    params: {
        parse: rawParams => rawParams as { campaignID: string, phaseType: AnnotationPhaseType },
    },
    component: ImportAnnotations,
})
