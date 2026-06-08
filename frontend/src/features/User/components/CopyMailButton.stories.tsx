import { CopyMailButton, type CopyMailButtonProps } from './CopyMailButton.tsx';
import type { Meta, StoryObj } from '@storybook/tanstack-react/dist';
import React from 'react';
import { BaseProvider } from '@/components/base/Provider';

const meta = {
    title: 'User/Components/CopyMailButton',
    component: CopyMailButton,
    decorators: [
        (Story: React.FC) => <BaseProvider><Story/></BaseProvider>,
    ],
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: [ 'autodocs' ],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        user: {
            control: { type: 'object' },
            type: {
                name: 'object',
                value: { email: 'string', displayName: 'string' }
            },
        },
    } satisfies Partial<Record<keyof CopyMailButtonProps, any>>,
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
    args: {
        user: {
            displayName: 'John Doe',
            email: 'john.doe@osmose.test',
        },
    } satisfies CopyMailButtonProps,
} satisfies Meta<typeof CopyMailButton>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {};
