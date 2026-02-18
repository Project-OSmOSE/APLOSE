import React, { Fragment } from 'react';

import { Head, HelpButton } from '@/components/ui';
import { ServerItem } from '@/features/storage';

import styles from './styles.module.scss'

export const StorageBrowser: React.FC = () => (
    <Fragment>
        <Head title="Storage" buttons={
            <HelpButton url="/doc/user/data/generate"
                        label="How to generate a dataset"/>
        }/>

        <div className={ styles.content }>
            <ServerItem name="datawork/datasets"/>
        </div>

    </Fragment>
)

export default StorageBrowser
