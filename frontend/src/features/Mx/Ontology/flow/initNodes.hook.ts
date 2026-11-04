import { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Edge, Node } from "@xyflow/react";
import * as API from "../api";

const COLUMN_SIZE = 256;
const ROW_GAP = 32;

type Data = API.SoundFragment | API.SourceFragment

export const useGetInitialNodes = (type: 'sound' | 'source') => {
  const { data: initialSources } = useQuery({ ...API.allSources, enabled: type === 'source' })
  const { data: initialSounds } = useQuery({ ...API.allSounds, enabled: type === 'sound' })

  const initialData: Data[] = useMemo(() => {
    switch (type) {
      case "sound":
        return initialSounds ?? []
      case 'source':
        return initialSources ?? []
    }
  }, [type, initialSounds, initialSources]);

    const ROOT = useMemo(() => ({
        id: '-1',
        preferredDisplay: 'Root',
        parent: null,
    } as Data), [])
    const calculateWordDimensions = useCallback((text: string) => {
        const div = document.createElement('div');
        div.setAttribute('style', `
      font-family: "Exo 2", Roboto;
      overflow: hidden;
      text-overflow: ellipsis;
      word-wrap: break-word;
      width: 16ch;
      padding: 0.25rem 0;
      border: 2px solid dark;
  `);
        if (text !== ROOT.preferredDisplay) div.innerHTML = text + '<br/>&nbsp;';
        document.body.appendChild(div);

        const dimensions = {
            width: div.clientWidth,
            height: div.clientHeight
        };
        div.parentNode?.removeChild(div)
        return dimensions;
    }, [])

    const compareSource = useCallback((a: Data, b: Data) => a.preferredDisplay.localeCompare(b.preferredDisplay), []);

    const getNodeBase = useCallback((nodeData: Data): Omit<Node<Data>, 'position'> => ({
        id: nodeData.id.toString(),
        type: 'ontology',
        data: nodeData,
    }), [])


    const getNode = useCallback((nodeData: Data = ROOT, column: number = -1, y: number = 0): {
        nodes: Node<Data>[],
        edges: Edge<Node<Data>>[],
        height: number
    } => {
        const nodes: Node<Data>[] = []
        const edges: Edge<Node<Data>>[] = []
        let height = calculateWordDimensions(nodeData.preferredDisplay).height
        const parentID = nodeData.parent?.id ?? ROOT.id

        const children = initialData?.filter(s => {
            if (nodeData === ROOT) return s.parent === null;
            return s.parent?.id === nodeData.id;
        }).sort(compareSource) ?? []

        if (children.length === 0) {
            nodes.push({
                ...getNodeBase(nodeData),
                position: {
                    x: column * COLUMN_SIZE,
                    y
                },
            })
        } else {
            const childrenTop = y
            let childrenHeight = -ROW_GAP;

            for (const child of children) {
                // eslint-disable-next-line react-hooks/immutability
                const { nodes: childNodes, edges: childEdges, height: childHeight } = getNode(child, column + 1, y)
                y += ROW_GAP + childHeight;
                childrenHeight += ROW_GAP + childHeight
                nodes.push(...childNodes)
                edges.push(...childEdges)
            }

            nodes.push({
                ...getNodeBase(nodeData),
                position: {
                    x: column * COLUMN_SIZE,
                    y: childrenTop + childrenHeight / 2 - height / 2
                },
                deletable: nodeData !== ROOT,
                selectable: nodeData !== ROOT,
                draggable: false,
            })
            height = Math.max(height, childrenHeight)
        }
        if (nodeData !== ROOT) {
            edges.push({
                id: nodeData.id.toString(),
                source: parentID,
                target: nodeData.id,
                type: 'smoothstep'
            })
        }

        return { nodes, edges, height }
    }, [ initialData, calculateWordDimensions, compareSource, getNodeBase ])

    return useMemo(() => getNode(), [initialSources, initialSounds, type]);
}
