import React, { Fragment } from 'react';
import { IonNote } from '@ionic/react';

import { dateToString } from '@/service/function';
import { FadedText, Link } from '@/components/ui';
import styles from './styles.module.scss';
import { useLoaderData } from '@tanstack/react-router';

export const DatasetInfoCreation: React.FC = () => {
    const { dataset } = useLoaderData({
        from: '/_authenticated/_admin/dataset/$datasetID',
        select: ({ dataset }) => ({ dataset }),
    })

    return <IonNote className={ styles.importNote } color="medium">
        Dataset imported on { dateToString(new Date(dataset.createdAt)) } by { dataset.owner.displayName }
    </IonNote>
}

export const DatasetName: React.FC<{
    name: string
    id?: string
    labeled?: true
    link?: true
}> = ({ name, id, labeled, link }) => {
    const { user } = useLoaderData({ from: '/_authenticated' })

    if (link && id && user.isAdmin) return <Fragment>
        { labeled && <FadedText>Dataset</FadedText> }
        <Link to="/dataset/$datasetID" preload={ false } params={ { datasetID: id } } color="primary">{ name }</Link>
    </Fragment>

    return <div>
        { labeled && <FadedText>Dataset</FadedText> }
        <p>{ name }</p>
    </div>
}
