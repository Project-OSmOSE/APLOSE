import type { ReactNode } from 'react';

export type Props<Data, InputData extends Record<string, any>> = {
    children?: ReactNode;
    input?: Partial<InputData>;
    onCreate?: (data: Data) => void;
}
