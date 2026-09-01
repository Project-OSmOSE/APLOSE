import type { Meta, StoryObj } from '@storybook/tanstack-react/dist';
import { ZoomButtons } from './Buttons';
import { ZoomRoot } from './Root'
import type { CampaignAnalysisFragment, GetCampaignQuery } from '@/features/AnnotationCampaign';


const meta = {
    title: 'Annotator/Zoom/Buttons',
    component: ZoomButtons,
    decorators: [
        (Story: any) => <ZoomRoot
            campaign={ { allowNumericZoom: true } as NonNullable<GetCampaignQuery['annotationCampaignById']> }
            analysis={ {
                legacyConfiguration: { zoomLevel: 2 },
            } as CampaignAnalysisFragment | null }
            children={ <Story/> }/>,

    ],
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: [ 'autodocs' ],
} satisfies Meta<typeof ZoomButtons>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {};

export const NoNumeric: Story = {
    decorators: [
        (Story: any) => <ZoomRoot
            campaign={ { allowNumericZoom: false } as NonNullable<GetCampaignQuery['annotationCampaignById']> }
            analysis={ {
                legacyConfiguration: { zoomLevel: 2 },
            } as CampaignAnalysisFragment | null }
            children={ <Story/> }/>,
    ],
};

export const NoPreprocessed: Story = {
    decorators: [
        (Story: any) => <ZoomRoot
            campaign={ { allowNumericZoom: true } as NonNullable<GetCampaignQuery['annotationCampaignById']> }
            analysis={ {} as CampaignAnalysisFragment | null }
            children={ <Story/> }/>,
    ],
};

export const NoNumericNorPreprocessed: Story = {
    decorators: [
        (Story: any) => <ZoomRoot
            campaign={ { allowNumericZoom: false } as NonNullable<GetCampaignQuery['annotationCampaignById']> }
            analysis={ {} as CampaignAnalysisFragment | null }
            children={ <Story/> }/>,
    ],
};

