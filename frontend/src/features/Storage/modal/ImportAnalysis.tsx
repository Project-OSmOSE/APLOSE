import React from 'react';
import { Item } from '@/features/Storage';
import { HelpButton } from '@/components/base/Button';
import { Dialog } from '@/components/base/Dialog';
import { useLoaderData } from '@tanstack/react-router';

export const ImportAnalysis: React.FC = () => {
    const { dataset } = useLoaderData({
        from: '/_authenticated/_admin/dataset/$datasetID',
        select: ({ dataset }) => ({ dataset }),
    })

    return (
        <Dialog.Content>
            <Dialog.Title>Import an analysis</Dialog.Title>
            <Dialog.CloseIcon/>

            { dataset && <Item path={ dataset.path } forceOpen disableImport/> }

            <HelpButton url="/doc/user/data/generate">
                How to generate a dataset
            </HelpButton>
        </Dialog.Content>
    )
}