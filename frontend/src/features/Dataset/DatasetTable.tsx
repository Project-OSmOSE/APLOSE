import React, { useMemo, useState } from 'react';
import { IonBadge, IonNote } from '@ionic/react';

import { type Order, Table, Tbody, Td, Th, Thead, Tr } from '@/components/ui';
import { dateToString } from '@/service/function';

import { DatasetName } from './DatasetInfo';
import { CampaignName } from '@/features/AnnotationCampaign/CampaignInfo';

import styles from './styles.module.scss'
import { useLoaderData } from '@tanstack/react-router';
import type { DatasetFragment } from '@/features/Dataset/api';


type Sort = {
    column: 'name' | 'createdAt' | 'annotationCampaigns',
    order: Order
}

type Dataset = DatasetFragment & {
    annotationCampaigns: {
        edges: Array<{
            node?: {
                isArchived: boolean
            } | null
        } | null>
    }
}

export const DatasetTable: React.FC = () => {
    const allDatasets = useLoaderData({ from: '/_authenticated/_admin/dataset/' })

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

                        const openCompare = bCampaigns.filter(c => !c.isArchived).length - aCampaigns.filter(c => !c.isArchived).length
                        const archiveCompare = bCampaigns.filter(c => c.isArchived).length - aCampaigns.filter(c => c.isArchived).length
                        if (openCompare !== 0) return openCompare
                        return archiveCompare
                    }
                    break;
            }
            return sorting.order === 'desc' ? compareFunc(a, b) : compareFunc(b, a);
        })
    }, [ allDatasets, sorting ]);

    if (!sortedDatasets || sortedDatasets.length === 0) return <IonNote color="medium"
                                                                        style={ { textAlign: 'center' } }>
        No datasets
    </IonNote>
    return <Table>
        <Thead>
            <Tr>
                <Th scope="col" sortable
                    order={ sorting.column === 'name' && sorting.order }
                    setOrder={ order => setSorting({ column: 'name', order: order }) }>
                    <div>
                        Name<br/>
                        <IonNote>Path</IonNote>
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
                    <DatasetName { ...d } link/>
                    <br/>
                    <p className={ styles.light }>{ d.path }</p>
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
                        e?.node && <CampaignName id={ e.node.id } key={ e.node.id } link>
                            { e.node.name }&nbsp;
                            { e.node.isArchived && <IonBadge color="medium">Archived</IonBadge> }
                        </CampaignName>) }</div>
                </Td>
            </tr>) }

        </Tbody>
    </Table>
}
