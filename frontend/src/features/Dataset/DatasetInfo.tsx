import React, { Fragment } from 'react';
import { IonNote } from '@ionic/react';
import { useCurrentUser, useDataset } from '@/api';

import { dateToString } from '@/service/function';
import { FadedText, Link } from '@/components/ui';
import styles from './styles.module.scss';
import { useParams } from '@tanstack/react-router';

export const DatasetInfoCreation: React.FC = () => {
    const { datasetID: id } = useParams({ strict: false });
    const { dataset } = useDataset({ id })
    if (!dataset) return <Fragment/>
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
    const { user } = useCurrentUser()

    if (link && id && user?.isAdmin) return <Fragment>
        { labeled && <FadedText>Dataset</FadedText> }
        <Link to="/dataset/$datasetID" params={ { datasetID: id } } color="primary">{ name }</Link>
    </Fragment>

    return <div>
        { labeled && <FadedText>Dataset</FadedText> }
        <p>{ name }</p>
    </div>
}
