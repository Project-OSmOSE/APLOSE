import React, { Fragment, useCallback } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { contrastOutline } from 'ionicons/icons/index.js';
import { Input } from '@/components/form';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { resetContrast, setContrast } from './slice';
import { selectContrast } from './selectors';
import { useLoaderData } from '@tanstack/react-router';

export const ContrastSelect: React.FC = () => {
    const { campaign } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const contrast = useAppSelector(selectContrast);
    const dispatch = useAppDispatch();

    const set = useCallback((value: number) => dispatch(setContrast(value)), [ dispatch ])
    const reset = useCallback(() => dispatch(resetContrast()), [ dispatch ])

    if (!campaign.allowImageTuning) return <Fragment/>
    return <div>
        <IonButton color="primary" fill="default" onClick={ reset }>
            <IonIcon icon={ contrastOutline } slot="icon-only"/>
        </IonButton>
        <Input type="range" name="brightness-range" min="0" max="100"
               value={ contrast }
               onChange={ e => set(e.target.valueAsNumber) }
               onDoubleClick={ reset }/>
        <Input type="number" name="brightness" min="0" max="100"
               value={ contrast }
               onChange={ e => set(e.target.valueAsNumber) }/>
    </div>
}
