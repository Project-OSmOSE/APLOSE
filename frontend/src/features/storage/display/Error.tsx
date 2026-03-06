import React, { Fragment, useMemo } from 'react';
import type { StorageItem } from '@/api';
import { IonNote } from '@ionic/react';
import { CopyErrorStackButton } from '@/components/ui';

export const StorageItemError: React.FC<{item: StorageItem }> = ({item}) =>
    useMemo(() => {
        if (!item.error) return <Fragment/>
        return <Fragment>
            <IonNote color="danger">{ item.error }</IonNote>
            <CopyErrorStackButton stack={ item.stack }/>
        </Fragment>
    }, [item])

