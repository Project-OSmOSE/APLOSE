import { Select, type SelectProps, type SelectValue } from './Select.tsx';
import type { Meta, StoryObj } from '@storybook/tanstack-react/dist';
import type { Colormap } from '@/features/Colormap';

export const AnalysisTestSample = [
    {
        id: '1',
        fft: {
            samplingFrequency: 128_000,
            overlap: 0.95,
            windowSize: 1024,
            nfft: 2048,
        },
        legacyConfiguration: { zoomLevel: 4 },
        colormap: { name: 'Greys' as Colormap },
    },
    {
        id: '2',
        fft: {
            samplingFrequency: 128_000,
            overlap: 0.95,
            windowSize: 1024,
            nfft: 1024,
        },
        colormap: { name: 'hsv' as Colormap },
    },
    {
        id: '3',
        fft: {
            samplingFrequency: 64_000,
            overlap: 0.95,
            windowSize: 512,
            nfft: 1024,
        },
        frequencyScaleParts: [ {
            minValue: 22_000,
            maxValue: 48_000,
        } ],
        colormap: { name: 'magma' as Colormap },
    },
] as SelectValue[]
const meta = {
    title: 'features/SpectrogramAnalysis/Select',
    component: Select,
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
        items: AnalysisTestSample,
    } satisfies SelectProps,
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {};
