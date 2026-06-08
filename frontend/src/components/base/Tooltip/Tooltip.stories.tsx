import { Tooltip } from './index.ts';
import { TooltipPositionerProps } from './index.parts.ts';
import type { Meta, StoryObj } from '@storybook/tanstack-react/dist';
import { Letter } from '@solar-icons/react';
import React from 'react';

const meta = {
    title: 'Base/Tooltip',
    component: (props: TooltipPositionerProps) => (
        <Tooltip.Root>
            <Tooltip.Trigger aria-label="Bold">
                <Letter aria-hidden="true"/>
            </Tooltip.Trigger>
            <Tooltip.Portal>
                <Tooltip.Positioner { ...props }>
                    <Tooltip.Popup>
                        <Tooltip.Arrow/>
                        Bold
                    </Tooltip.Popup>
                </Tooltip.Positioner>
            </Tooltip.Portal>
        </Tooltip.Root>
    ),
    decorators: [
        (Story: React.FC) => <Tooltip.Provider children={ <Story/> }/>,
    ],
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: [ 'autodocs' ],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        side: {
            control: { type: 'radio' },
            options: [
                'bottom',
                'top',
                'right',
                'left',
                'inline-start',
                'inline-end',
                'up',
            ] as TooltipPositionerProps['side'][],
            required: false,
            type: 'Side',
        },
        sideOffset: {
            control: { type: 'number' },
            required: false,
        },
    } satisfies Partial<Record<keyof TooltipPositionerProps, any>>,
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
    args: {
        side: 'top',
        sideOffset: 8,
    } satisfies TooltipPositionerProps,
} satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {};
