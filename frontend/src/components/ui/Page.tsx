import React, { ReactNode, useCallback } from 'react';
import { IonNote, IonSkeletonText } from '@ionic/react';
import styles from './ui.module.scss'
import { useCanGoBack, useRouter } from '@tanstack/react-router';
import { AltArrowLeft } from '@solar-icons/react';
import { Button } from '@/components/base/Button';

export const Head: React.FC<{
    title?: string;
    subtitle?: string | ReactNode;
    children?: ReactNode;
    buttons?: ReactNode;
    canGoBack?: boolean;
}> = ({ title, subtitle, children, buttons, canGoBack }) => {
    const router = useRouter()
    const _canGoBack = useCanGoBack()

    const back = useCallback(() => router.history.back(), [ router ])

    return <div className={ styles.head }>
        <div className={ styles.title }>
            <h2>{ title ??
                <IonSkeletonText animated style={ { width: 256, height: '1ch', justifySelf: 'center' } }/> }</h2>
            { subtitle && <IonNote color="medium">{ subtitle }</IonNote> }

            { canGoBack && _canGoBack && <Button className={ styles.BackButton }
                                   onClick={ back }>
                <AltArrowLeft weight="Linear" size={ 24 }/>
                Back
            </Button> }
        </div>

        { children && <div className={ styles.content }>
            { children }
        </div> }

        { buttons && <div className={ styles.buttons }>
            { buttons }
        </div> }

    </div>
}