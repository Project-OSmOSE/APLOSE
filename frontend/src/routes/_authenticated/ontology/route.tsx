import React, { useMemo } from 'react';
import { createFileRoute, Outlet, useParams } from '@tanstack/react-router'

import { Head, Tab, Tabs } from '@/components/ui';
import { Content, Page } from '@/components/layout';

import styles from './ontology.module.scss';

const OntologyPage: React.FC = () => {

    const { type } = useParams({ strict: false });

    return useMemo(() => <Page.Authenticated>
            <Content className={ styles.content }>
                <Head title="Ontology"/>

                <Tabs>
                    <Tab to="/ontology/$type" params={ { type: 'source' } }
                         active={ type === 'source' }>
                        Sources
                    </Tab>
                    <Tab to="/ontology/$type" params={ { type: 'sound' } }
                         active={ type === 'sound' }>
                        Sounds
                    </Tab>
                </Tabs>

                <Outlet/>
            </Content>
        </Page.Authenticated>,
        [ type ])
}

export const Route = createFileRoute('/_authenticated/ontology')({
    component: OntologyPage,
})
