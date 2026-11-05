import { useCallback, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import {
    addEdge,
    applyNodeChanges,
    Connection,
    Edge,
    getConnectedEdges,
    getIncomers,
    getOutgoers,
    Node,
    useEdgesState,
    useNodesState,
    useReactFlow
} from "@xyflow/react";
import { FinalConnectionState, InternalNodeBase } from "@xyflow/system";
import '@xyflow/react/dist/style.css'
import * as API from '../api'
import { useGetInitialNodes } from './initNodes.hook.ts'
import { ensureValidQueryData } from "@/api/utils.ts";

type NodeType = API.SoundFragment | API.SourceFragment

export const useOntologyTreeFlow = (type: 'sound' | 'source', {
    onCreated,
    enableEdit,
}: {
    onCreated: (data: API.SoundFragment | API.SourceFragment) => void,
    enableEdit: boolean
}) => {
    // Data
    const { mutateAsync: createSource } = useMutation(API.createSource)
    const { mutateAsync: createSound } = useMutation(API.createSound)
    const createData = useCallback(async (info: { parentNode: Node<API.SoundFragment | API.SourceFragment> }) => {
        const englishName = prompt('Node english name');
        if (!englishName) return;
        if (type === 'source') {
            const data = await createSource({
                englishName,
                parent: info.parentNode.data.id !== '-1' ? info.parentNode.data.id.toString() : undefined,
            })
            if (data?.source) onCreated(data.source)
        }
        if (type === 'sound') {
            const data = await createSound({
                englishName,
                parent: info.parentNode.data.id !== '-1' ? info.parentNode.data.id.toString() : undefined,
            })
            if (data?.sound) onCreated(data.sound)
        }
    }, [ createSource, createSound, type, onCreated ])

    const { mutateAsync: updateSource } = useMutation(API.updateSource)
    const { mutateAsync: updateSound } = useMutation(API.updateSound)
    const updateDataParent = useCallback(async (id: string, parent: string | null) => {
        let detailedData;
        switch (type) {
            case "source":
                detailedData = await ensureValidQueryData(API.sourceById({ id }))
                if (!detailedData) return
                await updateSource({ ...detailedData, parent })
                break;
            case "sound":
                detailedData = await ensureValidQueryData(API.soundById({ id }))
                if (!detailedData) return
                await updateSound({ ...detailedData, parent })
                break
        }
    }, [ updateSource, updateSound, type ])

    const { mutateAsync: removeSource } = useMutation(API.deleteSource)
    const { mutateAsync: removeSound } = useMutation(API.deleteSound)
    const removeData = useCallback(async (id: string) => {
        switch (type) {
            case "source":
                removeSource({ id })
                break;
            case "sound":
                removeSound({ id })
                break;
        }
    }, [ removeSource, removeSound, type ])

    // Flow
    const { screenToFlowPosition } = useReactFlow();
    const { fitView } = useReactFlow()

    const [ nodes, setNodes, onNodesChange ] = useNodesState<Node<NodeType>>([]);
    const [ edges, setEdges, onEdgesChange ] = useEdgesState<Edge>([]);

    const getNodeID = useCallback(() => {
        return Math.max(0, ...nodes.map(n => +n.id)) + 1
    }, [ nodes, ])
    const getEdgeID = useCallback(() => {
        return Math.max(0, ...edges.map(n => +n.id)) + 1
    }, [ edges, ])

    const onNodesDelete = useCallback((deleted: Node<NodeType>[]) => {
        if (!enableEdit) return;
        let id = getEdgeID();
        const getID = () => `${ id++ }`
        setEdges(deleted.reduce((acc, node) => {
            const incomers = getIncomers(node, nodes, edges);
            const outgoers = getOutgoers(node, nodes, edges);
            const connectedEdges = getConnectedEdges([ node ], edges);

            const remainingEdges = acc.filter((edge) => !connectedEdges.includes(edge));

            const createdEdges = incomers.flatMap(({ id: source }) =>
                outgoers.map(({ id: target }) => ({
                    id: getID(),
                    source,
                    target,
                    type: 'smoothstep'
                })),
            );
            for (const edge of createdEdges) {
                const child = nodes.find(n => n.id === edge.target);
                const parent = nodes.find(n => n.id === edge.source);
                if (!child || !parent) continue;
                const data: NodeType = {
                    ...child.data,
                    parent: { id: parent.data.id }
                }
                setNodes(nds => applyNodeChanges([ {
                    type: 'replace',
                    id: child.id,
                    item: { ...child, data }
                } ], nds))
                updateDataParent(data.id, parent.data.id)
            }

            return [ ...remainingEdges, ...createdEdges ];
        }, edges));
        for (const node of deleted) {
            removeData(node.data.id)
        }
    }, [ nodes, edges, getEdgeID, updateDataParent, removeData, enableEdit ]);

    const onEdgesDelete = useCallback((deleted: Edge[]) => {
        if (!enableEdit) return;
        for (const edge of deleted) {
            const target = nodes.find(n => n.id === edge.target);
            if (!target) continue;
            const data = { ...target.data, parent: null }
            setNodes(nds => applyNodeChanges([ {
                type: 'replace',
                id: target.id,
                item: { ...target, data }
            } ], nds))
            updateDataParent(data.id, null)
        }
    }, [ nodes, updateDataParent, enableEdit ])

    const onConnect = useCallback((params: Connection) => {
        if (!enableEdit) return;
        setEdges((eds) => addEdge(params, eds))
    }, [ enableEdit ]);

    const onConnectEnd = useCallback((_: MouseEvent | TouchEvent, connectionState: FinalConnectionState) => {
        if (!enableEdit) return;
        if (connectionState.fromNode && connectionState.toNode) { // Node added
            let child, parent: InternalNodeBase;
            if (connectionState.fromHandle!.type === 'source') {
                parent = connectionState.fromNode;
                child = connectionState.toNode;
            } else {
                parent = connectionState.toNode;
                child = connectionState.fromNode;
            }

            const data = {
                ...child.data,
                parent: {
                    id: parent.data.id
                }
            } as any
            setNodes(nds => applyNodeChanges([ {
                type: 'replace',
                id: child.id,
                item: { ...child, data }
            } ], nds))
            updateDataParent(data.id, parent.data.id as string)
        }

        if (!connectionState.fromNode) return;

        // when a connection is dropped on the pane it's not valid
        if (!connectionState.isValid) {
            createData({ parentNode: connectionState.fromNode as unknown as Node<NodeType> })
        }
    }, [ screenToFlowPosition, getNodeID, getEdgeID, nodes, createData, enableEdit, updateDataParent ],);

    const initialNodes = useGetInitialNodes(type as 'sound' | 'source');
    useEffect(() => {
        setNodes(initialNodes.nodes)
        setEdges(initialNodes.edges)
        fitView()
    }, [ initialNodes ]);

    return {
        nodes,
        onNodesChange,
        onNodesDelete,

        edges,
        onEdgesChange,
        onEdgesDelete,

        onConnect,
        onConnectEnd,
    }
}

