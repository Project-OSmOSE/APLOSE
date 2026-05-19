import React, { useMemo } from 'react';
import { createFileRoute, notFound } from '@tanstack/react-router';
import Markdown from 'react-markdown';

import styles from './public.module.scss';
import { getLoader } from '@/api/utils';
import { AuthRestAPI } from '@/api';

const TermsOfUse: React.FC = () => {
    const content: string = Route.useLoaderData()

    return useMemo(() => <div className={ styles.mdContent }>
                { content && <Markdown children={ content }/> }
            </div>
    , [ content ])
}

export const Route = createFileRoute('/(public)/terms')({
    loader: async () => {
        const {data, error} =  await getLoader(AuthRestAPI.endpoints.terms, undefined)
        if (error?.originalStatus === 404) throw notFound()
        return data
    },
    component: TermsOfUse,
})
