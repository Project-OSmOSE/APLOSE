import React from 'react';
import { Note, Spinner } from '@/components/base';
import { Center } from '@/components/layout';
import * as API from "../api";
import { CampaignCard } from './Card';
import styles from './styles.module.scss';


type CardsProps = {
    isFetching?: boolean
    campaigns?: API.AllFragment[]
}
export const CampaignCards: React.FC<CardsProps> = React.memo(({
                                                                   campaigns,
                                                                   isFetching,
                                                               }) => {
    if (isFetching)
        return <Center><Spinner/></Center>
    if (!campaigns || campaigns.length === 0)
        return <Note color="medium">No campaigns</Note>

    return <div className={ styles.cards }>
        { campaigns?.map(c =>
            <CampaignCard key={ c.id } campaign={ c }/>) }
    </div>
})
