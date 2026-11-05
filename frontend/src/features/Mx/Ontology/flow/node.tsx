import React, { useMemo } from 'react';
import { Handle, NodeProps, Position } from '@xyflow/react';
import { useParams } from '@tanstack/react-router';
import { Note } from '@/components/base';

import * as API from '../api'
import styles from './styles.module.scss'

type Props = NodeProps & { data: API.SoundFragment | API.SourceFragment; type: any }

export const Node: React.FC<Props> = ({ data }) => {
    const { id } = useParams({ strict: false });

    const selected = useMemo(() => data.id.toString() === id, [ data.id, id ])

    return <div className={ [ styles.node, selected ? styles.selected : '' ].join(' ') }>
        <p>{ data.preferredDisplay }</p>
        { data.id !== '-1' && <Note>ID: { data.id }</Note> }
        { data.preferredDisplay !== 'Root' && <Handle type="target" position={ Position.Left }/> }
        <Handle type="source" position={ Position.Right }/>
    </div>
}
