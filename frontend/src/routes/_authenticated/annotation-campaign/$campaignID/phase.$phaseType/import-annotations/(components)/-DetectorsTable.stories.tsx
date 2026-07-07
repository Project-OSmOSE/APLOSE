import { DetectorsTable, type DetectorsTableProps } from './-DetectorsTable.tsx';
import type { Meta, StoryObj } from '@storybook/tanstack-react/dist';
import { type QueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { Form } from '@/components/base';

const MockDetector = {
    __typename: 'DetectorNode',
    id: '1',
    name: 'Toto',
    configurations: [
        {
            __typename: 'DetectorConfigurationNode',
            id: '1',
            configuration: 'Storybook',
        },
    ],
}
const meta = {
    title: 'pages/ImportAnnotations/DetectorsTable',
    component: (props: DetectorsTableProps) => <Form style={{width: 'unset'}}>
        <DetectorsTable { ...props }/>
    </Form>,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: [ 'autodocs' ],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {},
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
    args: {
        names: [ MockDetector.name, 'storybook' ],
    } satisfies DetectorsTableProps,
} satisfies Meta<typeof DetectorsTable>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
    beforeEach: ({ parameters }: any) => {
        const qc: QueryClient = parameters.tanstack?.router?.context?.queryClient;
        qc?.setQueryData(queryKeys.detector.all, [ MockDetector ]);
    },
};
