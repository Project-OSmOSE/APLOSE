import React from 'react';
import { Note, Spinner } from '@/components/base';
import { Maybe } from "@/api/types.gql-generated.ts";
import { Center } from '@/components/layout/Display';
import { cleanGqlList } from "@/api/utils.ts";
import { CampaignCard, CampaignCardProps } from './Card';
import styles from './styles.module.scss';


type CardsProps = {
    isFetching?: boolean
    campaigns?: Array<CampaignCardProps['campaign'] & {
        phases?: Maybe<{
            results: Array<Maybe<CampaignCardProps['phases'][number]>>
        }>
    }>
}
export const CampaignCards: React.FC<CardsProps> = React.memo(({
                                                                   campaigns,
                                                                   isFetching,
                                                               }) => {
    if (isFetching)
        return <Center><Spinner/></Center>
    if (!campaigns || campaigns.length === 0)
        return <Center><Note color="medium">No campaigns</Note></Center>

    return <div className={ styles.cards }>
        { campaigns?.map(c =>
            <CampaignCard key={ c.id }
                          campaign={ c }
                          phases={ cleanGqlList(c.phases?.results) }/>) }
    </div>
})
