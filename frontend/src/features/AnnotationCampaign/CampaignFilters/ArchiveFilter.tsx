import React, { useCallback, useMemo } from 'react';
import { IonChip, IonIcon } from '@ionic/react';
import { closeCircle, swapHorizontal } from 'ionicons/icons';
import { Route } from '@/routes/_authenticated/annotation-campaign';
import { useNavigate } from '@tanstack/react-router';

export const AnnotationCampaignArchiveFilter: React.FC = () => {
    const { filter_isArchived } = Route.useSearch();
    const navigate = useNavigate();

    const exists = useMemo(() => filter_isArchived !== undefined && filter_isArchived !== null, [ filter_isArchived ])

    const toggle = useCallback(() => {
        navigate({
            to: Route.to,
            search: (prev) => ({
                ...prev,
                filter_isArchived: prev?.filter_isArchived ? null : prev?.filter_isArchived === false,
            }),
            replace: true,
        })
    }, [ navigate ])

    return <IonChip outline={ !exists }
                    onClick={ toggle }
                    color={ exists ? 'primary' : 'medium' }>
        Archived{ exists && `: ${ filter_isArchived ? 'True' : 'False' }` }
        { filter_isArchived === false && <IonIcon icon={ swapHorizontal }/> }
        { filter_isArchived === true && <IonIcon icon={ closeCircle }/> }
    </IonChip>
}