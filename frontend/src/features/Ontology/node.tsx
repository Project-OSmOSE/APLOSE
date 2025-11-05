import React, { useMemo } from 'react';
import { Handle, NodeProps, Position } from '@xyflow/react';
import styles from './styles.module.scss'
import { IonNote } from '@ionic/react';
import { OntologyItem } from './type';
import { type OntologyNavParams } from '@/features/UX';
import { useParams } from 'react-router-dom';


type Props = NodeProps & { data: OntologyItem; type: any }

export const OntologyNode: React.FC<Props> = ({ data }) => {
  const { id } = useParams<OntologyNavParams>();

  const selected = useMemo(() => data.id.toString() === id, [ data.id, id ])

  return <div className={ [ styles.node, selected ? styles.selected : '' ].join(' ') }>
    <p>{ data.englishName }</p>
    { data.id !== '-1' && <IonNote>ID: { data.id }</IonNote> }
    { data.englishName !== 'Root' && <Handle type="target" position={ Position.Left }/> }
    <Handle type="source" position={ Position.Right }/>
  </div>
}