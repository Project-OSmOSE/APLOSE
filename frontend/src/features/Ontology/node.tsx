import React, { useMemo } from 'react';
import { Handle, NodeProps, Position } from '@xyflow/react';
import styles from './styles.module.scss'
import { IonNote } from '@ionic/react';
import { OntologyItem } from './type';
import { Route } from '@/routes/_superuser/ontology/$type.$id'

type Props = NodeProps & { data: OntologyItem; type: any }

export const OntologyNode: React.FC<Props> = ({ data }) => {
    const { id } = Route.useParams();

    const selected = useMemo(() => data.id.toString() === id, [ data.id, id ])

    return <div className={ [ styles.node, selected ? styles.selected : '' ].join(' ') }>
        <p>{ data.englishName }</p>
        { data.id !== '-1' && <IonNote>ID: { data.id }</IonNote> }
        { data.englishName !== 'Root' && <Handle type="target" position={ Position.Left }/> }
        <Handle type="source" position={ Position.Right }/>
    </div>
}