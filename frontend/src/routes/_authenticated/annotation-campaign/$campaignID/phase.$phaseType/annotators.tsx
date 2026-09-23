import React, { useMemo, useState } from 'react';
import { createFileRoute, notFound } from '@tanstack/react-router'
import { Head } from '@/components/ui';
import { Content, Page } from '@/components/layout';
import { CampaignAPI } from '@/features/AnnotationCampaign';
import { Phase } from '@/features/AnnotationPhase';
import { FileRange } from '@/features/AnnotationFileRange';
import { User } from '@/features/User';
import { ensureValidQueryData } from '@/api/utils';
import { ButtonGroup } from '@/components/base';
import { useQuery } from "@tanstack/react-query";

const AnnotatorsPage: React.FC = () => {
    const { campaign, phase } = Route.useLoaderData()

    const [ userSelection, setUserSelection ] = useState<User.Fragment | null | undefined>();
    const [ groupSelection, setGroupSelection ] = useState<User.GroupFragment | null | undefined>();

    const {
        data: allUsers,
    } = useQuery({ ...User.allQuery, enabled: !!groupSelection })
    const groupSelectionUsers = useMemo(() => {
        const selectionIds = groupSelection?.users?.map(_u => _u?.id)
        const selection = allUsers?.filter(u => selectionIds?.includes(u.id))
        if (selection && selection.length > 0) return selection
        return undefined
    }, [ groupSelection, allUsers ])

    const filterAnnotators = useMemo(() => {
        if (userSelection) return [ userSelection ]
        if (groupSelectionUsers) return groupSelectionUsers
    }, [ userSelection, groupSelectionUsers ])

    return <Page.Authenticated>
        <Content oneContent>
            <Head title="Annotators"
                  canGoBack
                  subtitle={ `${ campaign.name } - ${ phase.phase }` }>
            </Head>

            <Content oneContent inner>
                <ButtonGroup>
                    <User.GroupSelect onValueChange={ setGroupSelection }/>
                    <User.Select items={ groupSelectionUsers } onValueChange={ setUserSelection }/>
                </ButtonGroup>

                <FileRange.Table campaign={ campaign }
                                 phase={ phase }
                                 filterAnnotators={ filterAnnotators }/>
            </Content>
        </Content>

    </Page.Authenticated>
}

export const Route = createFileRoute(
    '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType/annotators',
)({
    component: AnnotatorsPage,
    loader: async ({ params }) => {
        const [ { campaign }, phase ] = await Promise.all([
            ensureValidQueryData(CampaignAPI.byIdQuery({
                id: params.campaignID,
            })),
            ensureValidQueryData(Phase.getQuery({
                phase: params.phaseType,
                campaignID: params.campaignID,
            })),
        ])
        if (!campaign) throw notFound()
        if (!phase) throw notFound()
        const allFileRanges = await ensureValidQueryData(FileRange.listFileRanges({ phaseID: phase.id }))
        return { allFileRanges, phase, campaign }
    },
})
