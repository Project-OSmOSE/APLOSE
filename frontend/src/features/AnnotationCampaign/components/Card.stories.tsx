import { Card, type CardProps } from './Card.tsx';
import type { Meta, StoryObj } from '@storybook/tanstack-react/dist';
import { AnnotationPhaseType } from '@/api/types.gql-generated.ts';

const meta = {
    title: 'Features/AnnotationCampaign/Card',
    component: Card,
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
    } satisfies Partial<Record<keyof CardProps, any>>,
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
    args: {
        campaign: {
            id: '293',
            name: 'ASTROLABE 2025',
            deadline: null,
            isArchived: false,
            datasetName: 'APOCADO_C4D6_ST336363566',
            phases: {
                results: [
                    {
                        phase: AnnotationPhaseType.Annotation,
                        isOpen: false,
                        userTasksCount: 12,
                        userCompletedTasksCount: 12,
                    },
                    {
                        phase: AnnotationPhaseType.Verification,
                        isOpen: true,
                        userTasksCount: 37,
                        userCompletedTasksCount: 12,
                    },
                ],
            },
            tasksCount: 79320,
            completedTasksCount: 24814,
        },
    } satisfies CardProps,
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {};
