import type { Meta, StoryObj } from '@storybook/tanstack-react/dist';
import { ImageTuningButtons } from './index';
import { ImageSettingsRoot } from '../Root'


const meta = {
    title: 'Annotator/ImageSettings/ImageTuningButtons',
    component: ImageTuningButtons,
    decorators: [
        (Story: any) => <ImageSettingsRoot allowColormapChange
                                           allowImageTuning
                                           children={ <Story/> }/>,

    ],
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: [ 'autodocs' ],
} satisfies Meta<typeof ImageTuningButtons>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {};
