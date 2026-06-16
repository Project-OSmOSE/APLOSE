import React, { useMemo } from 'react';
import { createLazyFileRoute, Outlet, useParams } from '@tanstack/react-router'

import { Head, Tab, Tabs } from '@/components/ui';

import styles from './ontology.module.scss';
import { Content } from '@/components/layout/Content';

const OntologyPage: React.FC = () => {

    const { type } = useParams({ strict: false });

    return useMemo(() => <Content className={styles.content}>
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
        </Content>,
        [ type ])
}

export const Route = createLazyFileRoute('/_authenticated/_superuser/ontology')({
    component: OntologyPage,
})
