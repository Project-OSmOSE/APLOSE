import React, { useMemo } from 'react';
import { Handle, NodeProps, Position } from '@xyflow/react';
import { useParams } from '@tanstack/react-router';

import styles from './styles.module.scss'
import { OntologyItem } from './type';
import { Note } from '@/components/base/Note';

type Props = NodeProps & { data: OntologyItem; type: any }

export const OntologyNode: React.FC<Props> = ({ data }) => {
    const { id } = useParams({ strict: false });

    const selected = useMemo(() => data.id.toString() === id, [ data.id, id ])

    return <div className={ [ styles.node, selected ? styles.selected : '' ].join(' ') }>
        <p>{ data.englishName }</p>
        { data.id !== '-1' && <Note>ID: { data.id }</Note> }
        { data.englishName !== 'Root' && <Handle type="target" position={ Position.Left }/> }
        <Handle type="source" position={ Position.Right }/>
    </div>
}