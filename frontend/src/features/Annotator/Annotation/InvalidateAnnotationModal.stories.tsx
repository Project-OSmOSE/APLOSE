import { Dialog } from '@base-ui/react';
import { InvalidateAnnotationModal, type InvalidateAnnotationModalProps } from './InvalidateAnnotationModal.tsx';
import type { Meta, StoryObj } from '@storybook/tanstack-react/dist';
// @ts-expect-error: using different ts-config: moduleResolution (see tsconfig.storybook.json)
import { fn } from 'storybook/test';
import { AnnotationType } from '@/api';


const meta = {
    title: 'Annotator/InvalidateAnnotationModal',
    component: (props: InvalidateAnnotationModalProps) => (
        <Dialog.Root >
            <Dialog.Trigger>
                Open me
            </Dialog.Trigger>
            <Dialog.Portal>
                <InvalidateAnnotationModal { ...props }/>
            </Dialog.Portal>
        </Dialog.Root>
    ),
    parameters: {
        layout: 'padded',
    },
    tags: [ 'autodocs' ],
    args: {
        onAskLabelChange: fn(),
        annotation: {
            type: AnnotationType.Box,
        } as any
    } satisfies InvalidateAnnotationModalProps,
} satisfies Meta<typeof InvalidateAnnotationModal>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {};
