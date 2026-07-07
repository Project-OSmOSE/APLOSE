import React from 'react';

import styles from './styles.module.scss';
import { type AllCampaignsQuery } from './api';
import { Note } from '@/components/base/Note';
import { Card } from '@/features/AnnotationCampaign/components';
import { Spinner } from '@/components/base/Spinner';
import { Center } from '@/components/layout/Display';

type Campaign = NonNullable<NonNullable<AllCampaignsQuery['allAnnotationCampaigns']>['results'][number]>;

export const Cards: React.FC<{ campaigns?: Campaign[], isFetching?: boolean }> = React.memo(({
                                                                                                 campaigns,
                                                                                                 isFetching,
                                                                                             }) => {
    if (isFetching)
        return <Center><Spinner/></Center>
    if (!campaigns || campaigns.length === 0)
        return <Center><Note color="medium">No campaigns</Note></Center>

    return <div className={ styles.cards }>
        { campaigns?.map(c => <Card key={ c.id } campaign={ c }/>) }
    </div>
})
