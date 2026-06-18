import { Badge, type BadgeProps } from './Badge.tsx';
import type { Meta, StoryObj } from '@storybook/tanstack-react/dist';
import { DAY, NOW } from '@/features/AnnotationCampaign/hooks';

const meta = {
    title: 'Features/AnnotationCampaign/Badge',
    component: Badge,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: [ 'autodocs' ],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        campaign: {
            control: { type: 'object' },
            type: 'AnnotationCampaign',
        },
    } satisfies Partial<Record<keyof BadgeProps, any>>,
    args: {
        campaign: {
            deadline: null,
            isArchived: false,
        },
    } satisfies BadgeProps,
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Open: Story = {};

export const DueDate: Story = {
    args: {
        campaign: {
            deadline: new Date(2026, 5, 13).toISOString(),
            isArchived: false,
        },
    } satisfies BadgeProps,
};

export const DueDateWithinWeek: Story = {
    args: {
        campaign: {
            deadline: new Date(NOW + 7 * DAY).toISOString(),
            isArchived: false,
        },
    } satisfies BadgeProps,
};

export const Archived: Story = {
    args: {
        campaign: {
            deadline: new Date(2026, 5, 13).toISOString(),
            isArchived: true,
        },
    } satisfies BadgeProps,
};
