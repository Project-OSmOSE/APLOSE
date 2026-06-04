import { ExternalLink, type ExternalLinkProps } from './ExternalLink.tsx';
import type { Meta, StoryObj } from '@storybook/tanstack-react/dist';
import type { BaseColor } from '@/components/base/types';
import type { HTMLAttributeAnchorTarget } from 'react';

const meta = {
    title: 'Base/Button/ExternalLink',
    component: ExternalLink,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'padded',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: [ 'autodocs' ],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        children: {
            control: false,
        },
        color: {
            control: { type: 'radio' },
            options: [ 'default', 'primary', 'warning', 'danger' ] as BaseColor[],
            type: 'BaseColor',
        },
        target: {
            control: { type: 'radio' },
            options: [ '_blank', '_parent', '_self', '_top' ] as HTMLAttributeAnchorTarget[],
            type: 'HTMLAttributeAnchorTarget',
        },
    },
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
    args: {
        children: 'Some link',
        target: '_blank',
    } satisfies ExternalLinkProps,
} satisfies Meta<typeof ExternalLink>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
    args: {
        target: '_blank',
    } satisfies ExternalLinkProps,
};
