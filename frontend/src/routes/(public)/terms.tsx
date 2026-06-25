import React from 'react';
import { createFileRoute, notFound } from '@tanstack/react-router';
import Markdown from 'react-markdown';
import { AuthRestAPI } from '@/api';
import { AppStore } from '@/features/App';

const TermsOfUse: React.FC = () => {
    const content: string = Route.useLoaderData()
    return <Markdown children={ content }/>
}

export const Route = createFileRoute('/(public)/terms')({
    loader: async () => {
        let info = AuthRestAPI.endpoints.terms.select()(AppStore.getState() as any)
        if (info.data) return info

        const promise = AppStore.dispatch(AuthRestAPI.endpoints.terms.initiate())
        info = await promise
        promise.unsubscribe()

        if ((info.error as any)?.originalStatus === 404) throw notFound()
        if (!info.data) throw notFound()
        return info.data
    },
    component: TermsOfUse,
})
