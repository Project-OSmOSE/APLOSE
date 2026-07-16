import React, { useCallback, useRef, useState } from 'react';
import { Button, ButtonGroup, CreateDialog, Dialog, Field, Form, Note, Spinner, Toast } from '@/components/base'
import { useMutation, useQuery } from '@tanstack/react-query';
import { getErrorMessage } from '@/service/function';
import * as API from './api'
import { Table, Tbody, Td, Th, Thead, Tr } from '@/components/ui';
import { InstitutionSelect } from './InstitutionSelect';
import { TeamSelect } from './TeamSelect';
import { AddSquare, TrashBinTrash } from '@solar-icons/react';

export const NewPersonDialog: React.FC<CreateDialog.Props<API.PersonFragment, API.CreatePersonMutationVariables['input']>> = ({
                                                                                                                                  input,
                                                                                                                                  onCreate,
                                                                                                                                  children,
                                                                                                                              }) => {
    const { data, mutateAsync, isPending } = useMutation(API.createPerson)
    const toastManager = Toast.useToastManager()
    const closeRef = useRef<HTMLButtonElement>(null);
    const [ institutionRows, setInstitutionRows ] = useState<number[]>([ 1 ]);

    const submit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        try {
            const data = await mutateAsync({
                firstName: formData.get('firstName') as string,
                lastName: formData.get('lastName') as string,
                mail: formData.get('mail') as string | undefined,
                website: formData.get('website') as string | undefined,
                institutionRelations: institutionRows.map(id => ({
                    institution: formData.get(`institution_relations-${ id }-institution`) as string,
                    team: formData.get(`institution_relations-${ id }-team`) as string | undefined,
                    fromDate: formData.get(`institution_relations-${ id }-fromDate`) as string | undefined || undefined,
                    toDate: formData.get(`institution_relations-${ id }-toDate`) as string | undefined || undefined,
                })),
            })
            if (data?.person) {
                onCreate?.(data.person)
                closeRef.current?.click()
            }
        } catch (e) {
            console.error(e)
            toastManager.add({
                title: 'Fail creating person',
                description: getErrorMessage(e),
                type: 'error',
            })
        }
    }, [ mutateAsync, toastManager, onCreate, institutionRows ])

    const addInstitution = useCallback(() => setInstitutionRows(prev => [ ...prev, Math.max(0, ...prev) + 1 ]), [])

    return <Dialog.Content>
        <Dialog.Title>New person</Dialog.Title>
        <Dialog.CloseIcon ref={ closeRef }/>

        <Form onSubmit={ submit } gqlErrors={ data?.errors }>

            <Field.Root name="firstName">
                <Field.Label required>First name</Field.Label>
                <Field.Control type="text" required defaultValue={ input?.firstName }/>
                <Field.Error/>
            </Field.Root>

            <Field.Root name="lastName">
                <Field.Label required>Last name</Field.Label>
                <Field.Control type="text" required defaultValue={ input?.lastName }/>
                <Field.Error/>
            </Field.Root>

            <Field.Root name="mail">
                <Field.Label>Mail</Field.Label>
                <Field.Control type="email" defaultValue={ input?.mail || undefined }/>
                <Field.Error/>
            </Field.Root>

            <Field.Root name="website">
                <Field.Label>Website</Field.Label>
                <Field.Control type="url" defaultValue={ input?.website || undefined }/>
                <Field.Error/>
            </Field.Root>

            <Table>
                <Thead>
                    <Tr>
                        <Th scope="col"></Th>
                        <Th scope="col" start>Institution</Th>
                        <Th scope="col" start>Team</Th>
                        <Th scope="col">From</Th>
                        <Th scope="col">To</Th>
                        <Th scope="col"></Th>
                    </Tr>
                </Thead>
                <Tbody>
                    { institutionRows.map(id =>
                        <InstitutionRelationRowForm key={ id } id={ id }
                                                    onRemove={ () => setInstitutionRows(prev => prev.filter(i => i !== id)) }/>) }
                    <Tr>
                        <Th scope="row">
                            <Note color="medium">{ Math.max(0, ...institutionRows) + 1 }</Note>
                        </Th>
                        <Td colSpan={ 4 }>
                            <Button onClick={ addInstitution }>
                                <AddSquare weight="Linear" size={ 20 }/>
                                Add institution/team
                            </Button>
                        </Td>
                    </Tr>
                </Tbody>
            </Table>

            <ButtonGroup spaceBetween>
                <Dialog.Close>Cancel</Dialog.Close>
                { isPending && <Spinner/> }
                <Button color="primary" type="submit">Submit</Button>
            </ButtonGroup>
        </Form>

        { children }
    </Dialog.Content>
}

const InstitutionRelationRowForm: React.FC<{ id: number, onRemove: () => void }> = ({ id, onRemove }) => {
    const [ institution, setInstitution ] = useState<API.InstitutionFragment | null>(null);
    const { data: teams, isFetching: isFetchingTeams } = useQuery(API.institutionTeamsQuery({
        institutionId: institution?.id,
    }))

    return <Tr key={ id }>
        <Th scope="row"><Note color="medium">{ id }</Note></Th>
        <Td>
            <Field.Root name={ `institution_relations-${ id }-institution` }>
                <Field.Label required>Institution</Field.Label>
                <InstitutionSelect required creatable onValueChange={ setInstitution }/>
                <Field.Error/>
            </Field.Root>
        </Td>
        <Td>
            <Field.Root name={ `institution_relations-${ id }-team` }>
                <Field.Label>Team</Field.Label>
                <TeamSelect creatable
                            loading={ isFetchingTeams }
                            items={ teams }
                            additionalInput={ { institution: institution?.id } }
                            disabled={ !institution || isFetchingTeams }/>
                <Field.Error/>
            </Field.Root>
        </Td>
        <Td>
            <Field.Root name={ `institution_relations-${ id }-fromDate` }>
                <Field.Label required>From</Field.Label>
                <Field.Control type="date"/>
                <Field.Error/>
            </Field.Root>
        </Td>
        <Td>
            <Field.Root name={ `institution_relations-${ id }-toDate` }>
                <Field.Label required>To</Field.Label>
                <Field.Control type="date"/>
                <Field.Error/>
            </Field.Root>
        </Td>
        <Td>
            <Button color="danger" onClick={ onRemove }>
                <TrashBinTrash weight="Linear" size={ 20 }/>
            </Button>
        </Td>
    </Tr>
}
