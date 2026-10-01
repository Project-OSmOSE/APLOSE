import React, { HTMLProps } from 'react';
import { useLoaderData } from '@tanstack/react-router';
import { DatasetNode } from "@/api/types.gql-generated";
import { Badge, Link } from '@/components/base';

type BaseProps = Pick<HTMLProps<HTMLParagraphElement>, 'className'>
export const DatasetName: React.FC<{
    dataset: Pick<DatasetNode, 'name' | 'archived'> & Partial<Pick<DatasetNode, 'id'>>
    link?: true
} & BaseProps> = ({ dataset, link, ...props }) => {
    const { user } = useLoaderData({ from: '/_authenticated' })

    if (link && dataset.id && user.isAdmin)
        return <Link { ...props }
                     to="/dataset/$datasetID" preload={ false } params={ { datasetID: dataset.id } }
                     color="primary">
            { dataset.name }&nbsp;{ dataset.archived && <Badge color='medium'>Archived</Badge> }
        </Link>

    return <p { ...props }>
        { dataset.name }&nbsp;{ dataset.archived && <Badge color='medium'>Archived</Badge> }
    </p>
}
