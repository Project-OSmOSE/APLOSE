import type { Meta, StoryObj } from '@storybook/tanstack-react/dist';
import { type QueryClient } from '@tanstack/react-query';
import { useCanGoBack, useLoaderData, useParams } from '@tanstack/react-router';
// @ts-expect-error: using different ts-config: moduleResolution (see tsconfig.storybook.json)
import { mocked } from 'storybook/test';

import { AnnotationPhaseType } from '@/api/types.gql-generated.ts';
import { Toast } from '@/components/base/index.ts';
import { StoreProvider } from '@/features/App';
import { ImportAnnotationsPage } from './(components)/-page';


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
    title: 'pages/ImportAnnotations',
    component: ImportAnnotationsPage,
    beforeEach: ({ parameters }: any) => {
        mocked(useCanGoBack).mockReturnValue(true)
        mocked(useLoaderData).mockReturnValue({
            campaign: {
                name: 'Storybook campaign',
                dataset: {
                    name: 'Storybook dataset',
                },
            },
        })

        mocked(useParams).mockReturnValue({
            campaignID: '1',
            phaseType: AnnotationPhaseType.Verification,
        })

        const qc: QueryClient = parameters.tanstack?.router?.context?.queryClient;
        qc?.setQueryData([ 'detector' ], [ MockDetector ]);
    },
    decorators: [
        (Story: any) => <Toast.Provider><Story/></Toast.Provider>,
        (Story: any) => <StoreProvider><Story/></StoreProvider>,
    ],
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: [ 'autodocs' ],
} satisfies Meta<typeof ImportAnnotationsPage>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {};
