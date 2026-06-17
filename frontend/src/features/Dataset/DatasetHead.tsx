import React from 'react';
import { Calendar } from '@solar-icons/react';
import { Head } from '@/components/ui';

import { datetimeToString } from '@/service/function';
import styles from './styles.module.scss';
import { useLoaderData } from '@tanstack/react-router';
import { Note } from '@/components/base/Note';

export const DatasetHead: React.FC = () => {
    const { dataset } = useLoaderData({
        from: '/_authenticated/_admin/dataset/$datasetID',
        select: ({ dataset }) => ({ dataset }),
    })

    return <Head title={ dataset.name }
                 subtitle={ dataset.path }
                 canGoBack>
        { dataset.description && <p>{ dataset.description }</p> }
        <div className={ styles.info }>
            <Calendar/>
            <Note>Start:</Note>
            <p>{ datetimeToString(dataset.start) }</p>
            <Note>End:</Note>
            <p>{ datetimeToString(dataset.end) }</p>
        </div>
    </Head>
}