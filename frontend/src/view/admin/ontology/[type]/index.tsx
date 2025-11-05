import React, { useCallback, useEffect } from 'react';
import styles from './styles.module.scss'
import { Navigate, Outlet, useNavigate, useParams } from 'react-router-dom';
import { Background, Controls, Node, ReactFlow, useOnSelectionChange } from '@xyflow/react';
import { SoundNode, SourceNode, useAllSounds, useAllSources, useSoundCRUD, useSourceCRUD } from '@/api';
import { NewNode, NODE_ORIGIN, NODE_TYPES, useGetInitialNodes, useOntologyTreeFlow } from '@/features/Ontology';
import { type OntologyNavParams } from '@/features/UX';


type DataType = Pick<SoundNode | SourceNode, 'id' | 'englishName'> & {
  parent?: Pick<SoundNode | SourceNode, 'id'> | null
}

export const OntologyTab: React.FC = () => {
  const { type } = useParams<OntologyNavParams>();

  const { allSources: initialSources } = useAllSources({ skip: type !== 'source' })
  const {
    create: createSource,
    update: updateSource,
    remove: removeSource,
  } = useSourceCRUD()

  const { allSounds: initialSounds } = useAllSounds({ skip: type !== 'sound' })
  const {
    create: createSound,
    update: updateSound,
    remove: removeSound,
  } = useSoundCRUD()

  const getInitialNodes = useGetInitialNodes((type === 'source' ? initialSources : type === 'sound' ? initialSounds : undefined) ?? undefined);
  const navigate = useNavigate()

  const onNewNode = useCallback(async (info: NewNode<DataType>) => {
    const englishName = prompt('Node english name');
    if (!englishName) return;
    if (type === 'source') {
      const data = await createSource({
        englishName,
        parent_id: info.parentNode.data.id !== '-1' ? info.parentNode.data.id.toString() : undefined,
      }).unwrap()
      const id = data.postSource?.data?.id
      if (id) navigate(`/admin/ontology/source/${ id }`)
    }
    if (type === 'sound') {
      const data = await createSound({
        englishName,
        parent_id: info.parentNode.data.id !== '-1' ? info.parentNode.data.id.toString() : undefined,
      }).unwrap()
      const id = data.postSound?.data?.id
      if (id) navigate(`/admin/ontology/sound/${ id }`)
    }
  }, [ createSource, createSound, type ])

  const onSelectionChange = useCallback(({ nodes }: { nodes: Node<{ id: string }>[] }) => {
    if (nodes.length > 0) navigate(`/admin/ontology/${ type }/${ nodes[0].data.id }`)
    else navigate(`/admin/ontology/${ type }`)
  }, [ type ])
  useOnSelectionChange({ onChange: onSelectionChange })

  const update = useCallback((data: DataType) => {
    if (type === 'source') updateSource({ ...data, id: +data.id, parent_id: data.parent?.id ?? null })
    if (type === 'sound') updateSound({ ...data, id: +data.id, parent_id: data.parent?.id ?? null })
  }, [ updateSource, updateSound, type ])

  const deleteNode = useCallback((data: DataType) => {
    if (type === 'source') removeSource(data)
    if (type === 'sound') removeSound(data)
  }, [ removeSource, removeSound, type ])

  const {
    nodes,
    setNodes,
    onNodesChange,
    onNodesDelete,
    edges,
    setEdges,
    onEdgesChange,
    onEdgesDelete,
    onConnect,
    onConnectEnd,
  } = useOntologyTreeFlow<DataType>({
    onNew: onNewNode,
    patch: update,
    del: deleteNode,
  })

  useEffect(() => {
    const { nodes, edges } = getInitialNodes()
    setNodes(nodes)
    setEdges(edges)
  }, [ initialSources, initialSounds, type ]);


  if (type !== 'source' && type !== 'sound') return <Navigate to="/annotation-campaign" replace/>
  return <div className={ styles.tabContent }>
    <ReactFlow nodes={ nodes }
               nodeTypes={ NODE_TYPES }
               edges={ edges }
               onNodesChange={ onNodesChange }
               onNodesDelete={ onNodesDelete }
               onEdgesChange={ onEdgesChange }
               onEdgesDelete={ onEdgesDelete }
               onConnect={ onConnect }
               onConnectEnd={ onConnectEnd }
               fitView
               fitViewOptions={ { padding: 2 } }
               selectionKeyCode={ null }
               multiSelectionKeyCode={ null }
               nodeOrigin={ NODE_ORIGIN }>
      <Background/>
      <Controls showInteractive={ false }/>
    </ReactFlow>

    <Outlet/>
  </div>
}