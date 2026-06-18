import React from 'react';

import styles from './styles.module.scss';
import { type AllCampaignsQuery } from './api';
import { Note } from '@/components/base/Note';
import { Card } from '@/features/AnnotationCampaign/components';

type Campaign = NonNullable<NonNullable<AllCampaignsQuery['allAnnotationCampaigns']>['results'][number]>;

export const Cards: React.FC<{ campaigns?: Campaign[] }> = React.memo(({ campaigns }) => {
    if (!campaigns || campaigns.length === 0)
        return <Note color="medium">No campaigns</Note>

    return <div className={ styles.cards }>
        { campaigns?.map(c => <Card key={ c.id } campaign={ c }/>) }
    </div>
})
