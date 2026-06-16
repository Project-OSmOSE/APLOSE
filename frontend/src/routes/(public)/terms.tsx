import React from 'react';
import { createFileRoute, notFound } from '@tanstack/react-router';
import Markdown from 'react-markdown';
import { getLoader } from '@/api/utils';
import { AuthRestAPI } from '@/api';

const TermsOfUse: React.FC = () => {
    const content: string = Route.useLoaderData()
    return <Markdown children={ content }/>
}

export const Route = createFileRoute('/(public)/terms')({
    loader: async () => {
        const { data, error } = await getLoader(AuthRestAPI.endpoints.terms, undefined)
        if (error?.originalStatus === 404) throw notFound()
        if (!data) throw notFound()
        return data
    },
    component: TermsOfUse,
})
