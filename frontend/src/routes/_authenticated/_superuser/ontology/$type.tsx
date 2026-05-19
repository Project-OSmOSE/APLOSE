import React, { useCallback, useEffect, useMemo } from 'react';
import { createFileRoute, notFound, Outlet, useNavigate } from '@tanstack/react-router'
import { Background, Controls, Node, ReactFlow, useOnSelectionChange, useReactFlow } from '@xyflow/react';

import { SoundNode, SourceNode, useAllSounds, useAllSources, useSoundCRUD, useSourceCRUD } from '@/api';
import { NewNode, NODE_ORIGIN, NODE_TYPES, useGetInitialNodes, useOntologyTreeFlow } from '@/features/Ontology';

import styles from './$type.module.scss';


type DataType = Pick<SoundNode | SourceNode, 'id' | 'englishName'> & {
    parent?: Pick<SoundNode | SourceNode, 'id'> | null
}

const OntologyTab: React.FC = () => {
    const type = Route.useParams({select: ({type}) => type})

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
            const id = data.postSource?.source?.id
            if (id) navigate({
                to: '/ontology/$type/$id',
                params: { type: 'source', id },
                replace: true,
            })
        }
        if (type === 'sound') {
            const data = await createSound({
                englishName,
                parent_id: info.parentNode.data.id !== '-1' ? info.parentNode.data.id.toString() : undefined,
            }).unwrap()
            const id = data.postSound?.sound?.id
            if (id) navigate({
                to: '/ontology/$type/$id',
                params: { type: 'sound', id },
                replace: true,
            })
        }
    }, [ createSource, createSound, type, navigate ])

    const onSelectionChange = useCallback(({ nodes }: { nodes: Node<{ id: string }>[] }) => {
        if (nodes.length > 0) navigate({
            to: '/ontology/$type/$id',
            params: { type, id: nodes[0].data.id },
            replace: true,
        })
        else navigate({ to: '/ontology/$type', params: { type }, replace: true })
    }, [ type, navigate ])
    useOnSelectionChange({ onChange: onSelectionChange })

    const update = useCallback((data: DataType) => {
        if (type === 'source') updateSource({ ...data, id: data.id, parent_id: data.parent?.id ?? null })
        if (type === 'sound') updateSound({ ...data, id: data.id, parent_id: data.parent?.id ?? null })
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

    const { fitView } = useReactFlow()
    useEffect(() => {
        const { nodes, edges } = getInitialNodes()
        setNodes(nodes)
        setEdges(edges)
        fitView()
    }, [ initialSources, initialSounds, type ]);

    return useMemo(() => <div className={ styles.tabContent }>
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
        </div>,
        [ nodes, edges, onNodesChange, onNodesDelete, onConnect, onConnectEnd, onEdgesChange, onEdgesDelete ])
}

export const Route = createFileRoute('/_authenticated/_superuser/ontology/$type')({
    beforeLoad: ({ params }) => {
        const { type } = params
        if (type !== 'source' && type !== 'sound') throw notFound()
        return { type: type as 'source' | 'sound' }
    },
    component: OntologyTab,
})
