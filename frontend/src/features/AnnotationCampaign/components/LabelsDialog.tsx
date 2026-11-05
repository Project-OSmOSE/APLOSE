import React, { MouseEvent, useCallback, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { BaseUIEvent } from "@base-ui/react";
import { Button, ButtonGroup, Checkbox, Dialog, Spinner, Toast } from "@/components/base";
import { Table, Tbody, Td, Th, Thead, Tr } from '@/components/ui';
import * as API from "../api"

type Props = {
    campaign: Pick<API.Fragment, 'id' | 'name' | 'hasChangePermission' | 'archived'>,
}
export const CampaignLabelsDialog: React.FC<Props> = (props) => (
    <Dialog.Root>
        <Dialog.Trigger color="medium">
            Labels
        </Dialog.Trigger>
        <Dialog.Portal>
            <CampaignLabelsDialogContent { ...props }/>
        </Dialog.Portal>
    </Dialog.Root>
)

const CampaignLabelsDialogContent: React.FC<Props> = ({ campaign }) => {
    const { data: labels, isFetching } = useQuery(API.labelsByIdQuery(campaign))

    const [ updateEnabled, setUpdateEnabled ] = useState<boolean>(false);
    const enableDisableUpdate = useCallback(() => {
        setUpdateEnabled(prev => !prev);
    }, [ setUpdateEnabled ])

    return <Dialog.Content>
        <Dialog.Title>
            { campaign.name } labels { isFetching && <Spinner/> }
        </Dialog.Title>
        <Dialog.CloseIcon/>

        <Table>
            <Thead>
                <Tr>
                    <Th scope="col">Label</Th>
                    <Th scope="col">Acoustic features</Th>
                </Tr>
            </Thead>
            <Tbody>
                { labels?.map(rel =>
                        <LabelRow key={ rel.id }
                                  campaign={ campaign }
                                  labelRelation={ rel }
                                  disabled={ !updateEnabled }/>) }
            </Tbody>
        </Table>

        { campaign.hasChangePermission && !campaign.archived && labels && <ButtonGroup end>
            <Button onClick={ enableDisableUpdate }>
                { updateEnabled ? 'Disabled' : 'Enable' } update
            </Button>
        </ButtonGroup> }
    </Dialog.Content>
}

const LabelRow: React.FC<{
    campaign: Pick<API.Fragment, 'id'>,
    labelRelation: API.LabelRelationFragment,
    disabled: boolean,
}> = ({ campaign, labelRelation, disabled }) => {
    const {
        mutateAsync: updateLabelAcousticFeatures,
        isPending: isSubmitting,
    } = useMutation(API.updateLabelAcousticFeaturesMutation);
    const toast = Toast.useToastManager()

    const onLabelChecked = useCallback(async (event: BaseUIEvent<MouseEvent>) => {
        event.stopPropagation()
        event.preventDefault()
        try {
            const data = await updateLabelAcousticFeatures({
                campaignID: campaign.id,
                relationId: labelRelation.id,
                enableAcousticFeatures: !labelRelation.enableAcousticFeatures
            })
            if (data?.errors?.length) {
                toast.addGqlError({ title: 'Fail updating label', errors: data.errors })
            } else {
                toast.add({ title: 'Label updated', type: 'success' })
            }
        } catch (error) {
            toast.addError({ title: 'Fail updating label', error })
        }
    }, [ labelRelation, campaign, updateLabelAcousticFeatures, toast ])

    return <Tr>
        <Th scope="row">
            { labelRelation.label.preferredDisplay }
            { isSubmitting && <Spinner/> }
        </Th>
        <Td center>
            <Checkbox checked={ labelRelation.enableAcousticFeatures }
                      disabled={ isSubmitting || disabled }
                      onClick={ onLabelChecked }/>
        </Td>
    </Tr>
}