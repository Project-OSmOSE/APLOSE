import React, { Fragment, useCallback } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { sunnyOutline } from 'ionicons/icons/index.js';
import { Input } from '@/components/form';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { resetBrightness, selectBrightness, setBrightness } from '@/features/Annotator/VisualConfiguration';
import { useLoaderData } from '@tanstack/react-router';

export const BrightnessSelect: React.FC = () => {
    const { campaign } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const brightness = useAppSelector(selectBrightness);
    const dispatch = useAppDispatch();

    const set = useCallback((value: number) => dispatch(setBrightness(value)), [ dispatch ])
    const reset = useCallback(() => dispatch(resetBrightness()), [ dispatch ])

    if (!campaign.allowImageTuning) return <Fragment/>
    return <div>
        <IonButton color="primary" fill="default" onClick={ reset }>
            <IonIcon icon={ sunnyOutline } slot="icon-only"/>
        </IonButton>
        <Input type="range" name="brightness-range" min="0" max="100"
               value={ brightness }
               onChange={ e => set(e.target.valueAsNumber) }
               onDoubleClick={ reset }/>
        <Input type="number" name="brightness" min="0" max="100"
               value={ brightness }
               onChange={ e => set(e.target.valueAsNumber) }/>
    </div>
}
