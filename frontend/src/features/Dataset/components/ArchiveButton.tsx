import React, { Fragment, useCallback, useState } from 'react';
import { useMutation } from "@tanstack/react-query";
import { ArchiveLinearIcon, CheckCircleBoldIcon } from '@solar-icons/react';
import { AnnotationCampaignNode, DatasetNode, Maybe } from "@/api/types.gql-generated.ts";
import { Button, ButtonGroup, Dialog, Link, Note, Spinner, Toast } from '@/components/base';
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/ui";
import { cleanGqlList } from "@/api/utils.ts";
import { Campaign } from '@/features/AnnotationCampaign'
import * as API from '../api'

export type DatasetArchiveButtonProps = {
    dataset: Pick<DatasetNode, 'id' | 'archived' | 'hasChangePermission'>
    annotationCampaigns: (Campaign.ArchiveButtonProps['campaign']
        & Pick<AnnotationCampaignNode, 'name'>
        & { phases?: Maybe<{ results: Maybe<Campaign.ArchiveButtonProps['phases'][number]>[] }> }
        )[]
}
export const DatasetArchiveButton: React.FC<DatasetArchiveButtonProps> = ({ dataset, annotationCampaigns }) => {
    const { mutateAsync: archiveDataset, isPending: isArchivingDataset } = useMutation(API.archiveMutation)

    const toast = Toast.useToastManager()

    const archive = useCallback(async () => {
        try {
            await archiveDataset({ id: dataset.id })
        } catch (error) {
            toast.addError({ title: 'Fail archiving dataset', error })
        }
    }, [ dataset, archiveDataset, toast ]);

    // Static data to keep dialog open event when all campaigns are archived
    const [ openCampaigns ] = useState(annotationCampaigns.filter(a => !a.archived))

    if (dataset.archived || !dataset.hasChangePermission) return <Fragment/>
    if (openCampaigns.length === 0)
        return <Button color="medium" onClick={ archive }>
            <ArchiveLinearIcon size={ 20 }/>
            Archive
            { isArchivingDataset && <Spinner size={ 20 }/> }
        </Button>
    return <Dialog.Root>
        <Dialog.Trigger color="medium">
            <ArchiveLinearIcon size={ 20 }/>
            Archive
            { isArchivingDataset && <Spinner size={ 20 }/> }
        </Dialog.Trigger>
        <Dialog.Portal>
            <Dialog.Content>
                <Dialog.Title>There is still open campaigns on this dataset</Dialog.Title>
                <Dialog.CloseIcon/>

                <Table>
                    <Thead>
                        <Tr>
                            <Th scope='col' start>Campaign</Th>
                            <Th scope='col'></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        { openCampaigns.map(c => <Tr key={ c.id }>
                            <Th scope='row'>
                                <Link to='/annotation-campaign/$campaignID'
                                      params={ { campaignID: c.id } }
                                      target='_blank'>
                                    { c.name }
                                </Link>
                            </Th>
                            <Td>
                                { annotationCampaigns.find(ac => ac.id === c.id)?.archived ?
                                    <Note color='success'><CheckCircleBoldIcon/></Note>
                                    : <Campaign.ArchiveButton campaign={ c }
                                                              phases={ cleanGqlList(c.phases?.results) }/> }
                            </Td>
                        </Tr>) }
                    </Tbody>
                </Table>

                <ButtonGroup spaceBetween>
                    <Dialog.Close color='medium'>Cancel</Dialog.Close>
                    <Dialog.Close color='primary'
                                  disabled={ annotationCampaigns.filter(a => !a.archived).length > 0 }
                                  onClick={ archive }>
                        Archive dataset
                    </Dialog.Close>
                </ButtonGroup>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
}
