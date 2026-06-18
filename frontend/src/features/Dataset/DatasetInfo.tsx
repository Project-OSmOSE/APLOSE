import React, { Fragment } from 'react';
import { FadedText } from '@/components/ui';
import { useLoaderData } from '@tanstack/react-router';
import { Link } from '@/components/base/Button';


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
