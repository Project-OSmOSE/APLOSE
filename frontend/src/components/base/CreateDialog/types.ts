import type { ReactNode } from 'react';

export type Props<Data> = {
    children: ReactNode;
    input?: string;
    onCreate: (data: Data) => void;
}
