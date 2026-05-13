import React, { Fragment, useMemo } from 'react';
import { createLazyFileRoute, Outlet, useParams } from '@tanstack/react-router'

import { Head, Tab, Tabs } from '@/components/ui';

import styles from './index.module.scss';

const OntologyPage: React.FC = () => {

    const { type } = useParams({ strict: false });

    return useMemo(() => <Fragment>
            <Head title="Ontology"/>

            <div className={ styles.page }>
                <Tabs>
                    <Tab appPath="/admin/ontology/source"
                         active={ type === 'source' }>
                        Sources
                    </Tab>
                    <Tab appPath="/admin/ontology/sound"
                         active={ type === 'sound' }>
                        Sounds
                    </Tab>
                </Tabs>

                <Outlet/>
            </div>
        </Fragment>,
        [ type ])
}

export const Route = createLazyFileRoute('/_superuser/ontology/')({
    component: OntologyPage,
})
