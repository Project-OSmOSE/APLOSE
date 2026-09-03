import type { Meta, StoryObj } from '@storybook/tanstack-react/dist';
import { ConfigBar } from './ConfigBar';
// @ts-expect-error: using different ts-config: moduleResolution (see tsconfig.storybook.json)
import { mocked } from 'storybook/test';
import { useLoaderData } from '@tanstack/react-router';
import { AnalysisTestSample } from '@/features/SpectrogramAnalysis/components/Select.stories';
import type { GetAnnotationSpectrogramQuery } from '@/features/AnnotationSpectrogram';
import { ImageSettingsRoot } from '@/features/Annotator/ImageSettings/Root';

const meta = {
    title: 'Annotator/ConfigBar',
    component: ConfigBar,
    decorators: [
        (Story: any) => <ImageSettingsRoot allowColormapChange
                                           allowImageTuning
                                           children={ <Story/> }/>,
    ],
    beforeEach: () => {
        mocked(useLoaderData).mockReturnValue({
            analysis: AnalysisTestSample,
            spectrogram: {
                start: new Date().toISOString(),
            } as NonNullable<GetAnnotationSpectrogramQuery['annotationSpectrogramById']>,
        })
    },
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: [ 'autodocs' ],
} satisfies Meta<typeof ConfigBar>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {};
