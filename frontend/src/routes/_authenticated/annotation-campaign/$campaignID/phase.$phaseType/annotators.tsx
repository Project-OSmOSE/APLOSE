import React, { useState } from 'react';
import { createFileRoute, notFound } from '@tanstack/react-router'
import { Head } from '@/components/ui';
import { Content, Page } from '@/components/layout';
import { CampaignAPI } from '@/features/AnnotationCampaign';
import { Phase } from '@/features/AnnotationPhase';
import { FileRange, FileRangeAPI } from '@/features/AnnotationFileRange';
import { User } from '@/features/User';
import { ensureValidQueryData } from '@/api/utils';
import { ButtonGroup } from '@/components/base';

const AnnotatorsPage: React.FC = () => {
    const { campaign, phase } = Route.useLoaderData()

    const [ search, setSearch ] = useState<User.Fragment | null | undefined>();

    return <Page.Authenticated>
        <Content oneContent>
            <Head title="Annotators"
                  canGoBack
                  subtitle={ `${ campaign.name } - ${ phase.phase }` }>
            </Head>

            <Content oneContent inner>
                <ButtonGroup>
                    <User.Select onValueChange={ setSearch }/>
                </ButtonGroup>

                <FileRange.Table campaign={ campaign }
                                 phase={ phase }
                                 filterAnnotator={ search }/>
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
        const allFileRanges = await ensureValidQueryData(FileRangeAPI.listFileRanges({ phaseID: phase.id }))
        return { allFileRanges, phase, campaign }
    },
})
