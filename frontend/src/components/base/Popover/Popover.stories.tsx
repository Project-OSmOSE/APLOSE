import { Popover } from './index.ts';
import type { Meta, StoryObj } from '@storybook/tanstack-react/dist';
import React from 'react';
import { InfoCircle } from '@solar-icons/react';
import { Note } from '@/components/base/Note';
import { Button } from '../Button/Button.tsx';

type Props = {
    openOnHover: boolean,
    content: string,
    trigger: React.ReactNode,
    title?: string,
}
const meta = {
    title: 'Base/Popover',
    component: ({ openOnHover, content, trigger, title }: Props) => (
        <Popover.Root>
            <Popover.Trigger openOnHover={ openOnHover }>
                { trigger }
            </Popover.Trigger>
            <Popover.Content>
                { title && <Popover.Title>{ title }</Popover.Title> }
                { content }
            </Popover.Content>
        </Popover.Root>
    ),
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'padded',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: [ 'autodocs' ],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        trigger: {
            type: 'ReactNode',
        },
        title: {
            control: 'text',
            type: 'string',
        },
    } satisfies Partial<Record<keyof Props, any>>,
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
    args: {
        openOnHover: true,
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        trigger: 'Trigger me',
        title: undefined,
    } satisfies Props,
} satisfies Meta<typeof Popover>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {};

export const Icon: Story = {
    args: {
        trigger: <Note color="medium"><InfoCircle size={ 20 }/></Note>,
    },
};

export const WithButton: Story = {
    args: {
        trigger: <Button color="medium"><InfoCircle size={ 20 }/></Button>,
    },
};

export const WithTitle: Story = {
    args: {
        title: 'Note title',
    },
};
