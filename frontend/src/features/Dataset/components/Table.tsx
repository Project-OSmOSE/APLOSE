import React, { useMemo, useState } from 'react';
import { useQuery } from "@tanstack/react-query";

import { type Order, Table, Tbody, Td, Th, Thead, Tr } from '@/components/ui';
import { Note } from '@/components/base';
import { dateToString } from '@/service/function';

import { Campaign } from "@/features/AnnotationCampaign";

import * as API from '../api';
import styles from './styles.module.scss'
import { DatasetName } from './Name.tsx';


type Sort = {
    column: 'name' | 'createdAt' | 'annotationCampaigns',
    order: Order
}

type Dataset = API.Fragment & {
    annotationCampaigns: {
        edges: Array<{
            node?: {
                archived: boolean
            } | null
        } | null>
    }
}

export const DatasetTable: React.FC = () => {
    const { data: allDatasets } = useQuery(API.allWithCampaignsQuery)

    const [ sorting, setSorting ] = useState<Sort>({ column: 'createdAt', order: 'desc' });

    const sortedDatasets = useMemo(() => {
        if (!allDatasets) return allDatasets
        const collator = new Intl.Collator(undefined, {
            usage: 'sort',
            sensitivity: 'base',
        })
        return allDatasets.sort((a: Dataset, b: Dataset) => {
            let compareFunc;
            switch (sorting.column) {
                case 'createdAt':
                    compareFunc = (a: Dataset, b: Dataset) =>
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    break;
                case 'name':
                    compareFunc = (a: Dataset, b: Dataset) => collator.compare(a.name, b.name)
                    break;
                case 'annotationCampaigns':
                    compareFunc = (a: Dataset, b: Dataset) => {
                        const aCampaigns = a.annotationCampaigns.edges.map(e => e?.node).filter(n => !!n)
                        const bCampaigns = b.annotationCampaigns.edges.map(e => e?.node).filter(n => !!n)

                        const openCompare = bCampaigns.filter(c => !c.archived).length - aCampaigns.filter(c => !c.archived).length
                        const archiveCompare = bCampaigns.filter(c => c.archived).length - aCampaigns.filter(c => c.archived).length
                        if (openCompare !== 0) return openCompare
                        return archiveCompare
                    }
                    break;
            }
            return sorting.order === 'desc' ? compareFunc(a, b) : compareFunc(b, a);
        })
    }, [ allDatasets, sorting ]);

    if (!sortedDatasets || sortedDatasets.length === 0) return <Note color="medium"
                                                                     style={ { textAlign: 'center' } }>
        No datasets
    </Note>
    return <Table>
        <Thead>
            <Tr>
                <Th scope="col" sortable
                    order={ sorting.column === 'name' && sorting.order }
                    setOrder={ order => setSorting({ column: 'name', order: order }) }>
                    <div>
                        Name<br/>
                        <Note>Path</Note>
                    </div>
                </Th>

                <Th scope="col" sortable
                    order={ sorting.column === 'createdAt' && sorting.order }
                    setOrder={ order => setSorting({ column: 'createdAt', order: order }) }>
                    Created at
                </Th>

                <Th scope="col">Dates</Th>
                <Th scope="col">Analysis</Th>
                <Th scope="col">Files</Th>

                <Th scope="col" sortable start
                    order={ sorting.column === 'annotationCampaigns' && sorting.order }
                    setOrder={ order => setSorting({ column: 'annotationCampaigns', order: order }) }>
                    Campaigns
                </Th>
            </Tr>
        </Thead>

        <Tbody>
            { sortedDatasets.map(d => <tr key={ d.id }>
                <Th scope="row">
                    <DatasetName dataset={ d } link/>
                    <Note color="medium">{ d.path }</Note>
                </Th>
                <Td>{ dateToString(d.createdAt) }</Td>
                <Td>
                    <p className={ styles.dates }>{ d.start && dateToString(d.start) }</p>
                    <p className={ styles.dates }>{ d.end && dateToString(d.end) }</p>
                </Td>
                <Td>{ d.analysisCount }</Td>
                <Td>{ d.spectrogramCount ?? 0 }</Td>
                <Td>
                    <div className={ styles.campaignList }> { d.annotationCampaigns.edges.map((e) =>
                        e?.node && <Campaign.Name campaign={ e.node }
                                                  key={ e.node.id }
                                                  link/>) }</div>
                </Td>
            </tr>) }

        </Tbody>
    </Table>
}
