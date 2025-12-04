import { Node } from '@xyflow/react';
import type { SoundNode, SourceNode } from '@/api';

export type OntologyItem = Pick<SoundNode | SourceNode, 'id' | 'englishName'> & {
  parent?: Pick<SoundNode | SourceNode, 'id'> | null
}

export type NewNode<NodeType extends Record<string, unknown>> = {
  parentNode: Node<NodeType>;
}
