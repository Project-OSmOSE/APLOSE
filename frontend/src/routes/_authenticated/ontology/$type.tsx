import React, { useCallback, useMemo } from 'react';
import { createFileRoute, notFound, Outlet, useNavigate } from '@tanstack/react-router'
import { Background, Controls, Node, ReactFlow, useOnSelectionChange } from '@xyflow/react';
import { useQuery } from '@tanstack/react-query';

import { ensureValidQueryData } from '@/api/utils';
import { MxOntology } from '@/features/Mx';
import { User } from "@/features/User";

import styles from './$type.module.scss';


const OntologyTab: React.FC = () => {
    const { data: user } = useQuery(User.currentQuery)
    const type = Route.useParams({ select: ({ type }) => type })

    const navigate = useNavigate()

    const onCreated = useCallback(async (data: MxOntology.SoundFragment | MxOntology.SourceFragment) => {
        navigate({
            to: '/ontology/$type/$id',
            params: { type, id: data.id },
            replace: true,
        })
    }, [ type, navigate ])

    const onSelectionChange = useCallback(({ nodes }: { nodes: Node<{ id: string }>[] }) => {
        if (nodes.length > 0) navigate({
            to: '/ontology/$type/$id',
            params: { type, id: nodes[0].data.id },
            replace: true,
        })
        else navigate({ to: '/ontology/$type', params: { type }, replace: true })
    }, [ type, navigate ])
    useOnSelectionChange({ onChange: onSelectionChange })

    const {
        nodes,
        onNodesChange,
        onNodesDelete,
        edges,
        onEdgesChange,
        onEdgesDelete,
        onConnect,
        onConnectEnd,
    } = MxOntology.useOntologyTreeFlow(type as 'sound' | 'source', { onCreated, enableEdit: !!user?.isSuperuser })

    return useMemo(() => <div className={ styles.tabContent }>
            <ReactFlow nodes={ nodes }
                       nodeTypes={ { ontology: MxOntology.Node } }
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
                       deleteKeyCode={ user?.isSuperuser ? "Delete" : null }
                       nodeOrigin={ [ 0.5, 0 ] }

                       edgesReconnectable={ user?.isSuperuser }
                       edgesFocusable={ user?.isSuperuser }
                       nodesConnectable={ user?.isSuperuser }
                       nodesDraggable={ user?.isSuperuser }>
                <Background/>
                <Controls showInteractive={ false }/>
            </ReactFlow>

            <Outlet/>
        </div>,
        [ nodes, edges, onNodesChange, onNodesDelete, onConnect, onConnectEnd, onEdgesChange, onEdgesDelete ])
}

export const Route = createFileRoute('/_authenticated/ontology/$type')({
    beforeLoad: ({ params }) => {
        const { type } = params
        if (type !== 'source' && type !== 'sound') throw notFound()
        return { type: type as 'source' | 'sound' }
    },
    loader: ({ params: { type } }) => {
        switch (type) {
            case 'source':
                return ensureValidQueryData(MxOntology.allSources)
            case 'sound':
                return ensureValidQueryData(MxOntology.allSounds)
        }
    },
    component: OntologyTab,
})
