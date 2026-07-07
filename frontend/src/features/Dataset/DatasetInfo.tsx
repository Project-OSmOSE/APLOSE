import React from 'react';
import { useLoaderData } from '@tanstack/react-router';
import { Link } from '@/components/base/Button';


export const DatasetName: React.FC<{
    name: string
    id?: string
    link?: true
}> = ({ name, id, link }) => {
    const { user } = useLoaderData({ from: '/_authenticated' })

    if (link && id && user.isAdmin)
        return <Link to="/dataset/$datasetID" preload={ false } params={ { datasetID: id } }
                     color="primary">{ name }</Link>

    return <p>{ name }</p>
}
