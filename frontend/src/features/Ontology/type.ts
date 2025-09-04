import { SoundNode, SourceNode } from "@/features/gql/types.generated.ts";
import { Node } from "@xyflow/react";

export type OntologyItem = Pick<SoundNode | SourceNode, 'id' | 'englishName'> & {
  parent?: Pick<SoundNode | SourceNode, 'id'> | null
}

export type NewNode<NodeType extends Record<string, unknown>> = {
  parentNode: Node<NodeType>;
}
