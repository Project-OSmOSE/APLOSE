import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { createFileRoute, useLoaderData, useRouter } from '@tanstack/react-router';

import { Head, Table, Tbody, Th, Thead, Tr } from '@/components/ui';
import { Button, ButtonGroup, Combobox, ComboboxSelect, Form, Note, Spinner, Toast } from '@/components/base';

import { AnnotationFileRangeInput, AnnotationPhaseType } from '@/api';
import { getNewItemID } from '@/service/function';

import { FileRangeInputRow } from '@/features/AnnotationFileRange';
import { queryClient } from '@/api/queryClient';
import { AnnotationFileRange } from '@/features';
import { UserAPI } from '@/features/User';
import { useMutation } from '@tanstack/react-query';
import { Content } from '@/components/layout/Content';
import { cleanGqlList } from '@/api/utils';

type FileRange = Omit<AnnotationFileRangeInput, 'id'> & {
    id: string;
    started?: boolean;
}

type N<T> = NonNullable<T>;
type User = N<N<UserAPI.AllUsersQuery['allUsers']>['results'][number]>
type Group = N<N<UserAPI.AllUsersQuery['allUserGroups']>['results'][number]>
type SearchValue = User | Group
export const Search: React.FC<{
    onSearch: (item: SearchValue) => void,
    fileRanges: FileRange[]
}> = ({ onSearch, fileRanges }) => {
    const { campaign } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const { users, groups } = Route.useLoaderData()
    const items = useMemo(() => {
        return [ ...users.filter(u => {
            if (!campaign?.spectrogramsCount) return true;
            const count = fileRanges
                .filter(f => f.annotatorId === u!.id)
                .reduce((count, range) => {
                    const last_index = range.lastFileIndex ?? campaign.spectrogramsCount ?? 0;
                    const first_index = range.firstFileIndex ?? 0;
                    return count + (last_index - first_index)
                }, 0) + 1
            return count < campaign.spectrogramsCount
        }), ...groups ]
    }, [ users, groups, fileRanges, campaign ]);
    const onValueChange = useCallback((value: SearchValue[]) => {
        if (value.length) onSearch(value[0])
    }, [ onSearch ])
    const { contains } = Combobox.useFilter({
        usage: 'search',
        sensitivity: 'base',
    })

    const filter = useCallback((itemValue: SearchValue, query: string): boolean => {
        switch (itemValue.__typename) {
            case 'UserGroupNode':
                return contains(itemValue, query, (item: Group) => item.name)
            case 'UserNode':
                return contains(itemValue, query, (item: User) => [ item.displayName, item.username ].join(' '))
        }
    }, [ contains ])
    return <ComboboxSelect placeholder="Search annotator or group..."
                           items={ items }
                           itemName="search"
                           filter={ filter }
                           itemToStringLabel={ item => {
                               switch (item.__typename) {
                                   case 'UserGroupNode':
                                       return item.name
                                   case 'UserNode':
                                       return item.displayName ?? item.username
                               }
                           } }
                           itemToStringValue={ item => item.id }
                           isItemEqualToValue={ (a, b) => a.id === b.id }
                           multiple
                           value={ [] as SearchValue[] }
                           onValueChange={ onValueChange }
    />
}

const EditAnnotators: React.FC = () => {
    const { campaign } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const { phase } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType' })
    const router = useRouter();
    const toastManager = Toast.useToastManager();
    const { users, groups, allFileRanges } = Route.useLoaderData()
    const {
        mutate: updateFileRanges,
        isPending: isSubmitting,
        error: errorSubmitting,
        status: submissionStatus,
    } = useMutation(AnnotationFileRange.API.updateMutation)
    const [ force, setForce ] = useState<boolean>()

    // File ranges
    const [ fileRanges, setFileRanges ] = useState<FileRange[]>(allFileRanges.map(r => ({
        id: r!.id,
        annotatorId: r!.annotator.id,
        firstFileIndex: r!.firstFileIndex,
        lastFileIndex: r!.lastFileIndex,
        started: !!r!.completedAnnotationTasks?.totalCount,
    })));
    const addFileRange = useCallback((item: SearchValue) => {
        if (!groups || !campaign?.spectrogramsCount) return;
        const newUsers: User[] = []
        switch (item.__typename) {
            case 'UserNode':
                newUsers.push(item);
                break;
            case 'UserGroupNode': {
                const ids = cleanGqlList(item.users).map(u => u.id)
                newUsers.push(...users.filter(u => ids.includes(u.id)))
                break
            }
        }
        setFileRanges(prev => {
            for (const newUser of newUsers) {
                prev = [ ...prev, {
                    id: getNewItemID(prev)?.toString(),
                    annotatorId: newUser!.id,
                    firstFileIndex: 1,
                    lastFileIndex: campaign.spectrogramsCount,
                } ]
            }
            return prev
        })
    }, [ users, groups, setFileRanges, campaign ])
    const updateFileRange = useCallback((fileRange: FileRange) => {
        setFileRanges(prev => prev.map(f => {
            if (f.id !== fileRange.id) return f;
            return { ...f, ...fileRange }
        }))
    }, [])
    const removeFileRange = useCallback((fileRange: FileRange) => {
        setFileRanges(prev => prev.filter(f => f.id !== fileRange.id))
    }, [])

    // Navigation
    const back = useCallback(() => router.history.back(), [ router ])

    // Submit
    const submit = useCallback(() => {
        updateFileRanges({ campaignID: campaign.id, phaseType: phase.phase, fileRanges, force })
    }, [ fileRanges, updateFileRanges, force, campaign, phase ])
    useEffect(() => {
        if (errorSubmitting) toastManager.addError({ title: 'Submission failed', error: errorSubmitting })
    }, [ errorSubmitting ]);
    useEffect(() => {
        if (submissionStatus === 'success') back()
    }, [ submissionStatus ]);

    return <Content oneContent>
        <Head title="Manage annotators"
              canGoBack
              subtitle={ `${ campaign.name } - ${ phase.phase }` }/>

        <Form center>
            <Search onSearch={ addFileRange } fileRanges={ fileRanges }/>


            <Table>
                <Thead>
                    <Tr>
                        <Th scope="col">Annotator</Th>
                        <Th scope="col" colSpan={ 2 }>
                            File range
                            <br/>
                            <small>(between 1 and { campaign?.spectrogramsCount })</small>
                            <br/>
                            <small className="disabled"><i>Start and end limits are included</i></small>
                        </Th>
                        <Th scope="col"/>
                    </Tr>
                </Thead>
                <Tbody>
                    { fileRanges.map((range, k) => {
                            const user = users.find(u => u?.id == range.annotatorId)
                            if (!user) return <Fragment/>
                            return <FileRangeInputRow key={ k }
                                                      range={ range }
                                                      annotator={ user }
                                                      onUpdate={ change => {
                                                          updateFileRange({
                                                              ...range,
                                                              ...change,
                                                          })
                                                      } }
                                                      setForced={ () => setForce(true) }
                                                      onDelete={ removeFileRange }/>
                        },
                    ) }
                </Tbody>

                { fileRanges.length === 0 && <Note color="medium">No annotators</Note> }
            </Table>

            { phase?.phase === 'Verification' && <Note>
                To fully verify your annotations, you should have a verification user that is not an annotator or at
                least two verification users
            </Note> }

            <ButtonGroup end>
                { isSubmitting && <Spinner/> }

                <Button disabled={ isSubmitting } color="primary" onClick={ submit }>
                    Update annotators
                </Button>
            </ButtonGroup>
        </Form>
    </Content>
}

export const Route = createFileRoute('/_authenticated/annotation-campaign/$campaignID/phase/$phaseType/edit-annotators')({
    params: {
        parse: rawParams => rawParams as { campaignID: string, phaseType: AnnotationPhaseType },
    },
    loader: async ({ params }) => {
        const [
            { users, groups },
            allFileRanges,
        ] = await Promise.all([
            queryClient.ensureQueryData(UserAPI.allQuery),
            queryClient.ensureQueryData(AnnotationFileRange.API.forPhaseQuery(params)),
        ])
        return { users, groups, allFileRanges }
    },
    component: EditAnnotators,
})