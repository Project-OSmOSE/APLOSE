import type { Meta, StoryObj } from '@storybook/tanstack-react/dist';
import { Dialog } from '@/components/base';
import { FileRangeForm } from './Form.tsx';
// @ts-expect-error: using different ts-config: moduleResolution (see tsconfig.storybook.json)
import { fn } from 'storybook/test';

type Props = {
    spectrogramsCount: number
    firstFileIndex: number
    lastFileIndex: number
}
const meta = {
    title: 'features/AnnotationFileRange/Form',
    component: ({
                    spectrogramsCount,
                    firstFileIndex, lastFileIndex,
                }: Props) => (
        <FileRangeForm campaign={ { spectrogramsCount } }
                       phase={ { id: '0' } }
                       annotator={ { id: '0', displayName: 'Tim Dup' } }
                       fileRange={ { id: '0', firstFileIndex, lastFileIndex } }
                       allFileRanges={ [
                           { id: '0', firstFileIndex, lastFileIndex },
                           { id: '1', firstFileIndex: 1, lastFileIndex: 500 },
                           { id: '2', firstFileIndex: 901, lastFileIndex: 1_100 },
                           { id: '3', firstFileIndex: 2_801, lastFileIndex: 3_100 },
                       ] }
                       setIsPending={ fn() }
                       onCancel={ fn() }
                       onSuccess={ fn() }
        />
    ),
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'padded',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: [ 'autodocs' ],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {},
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
    args: {
        spectrogramsCount: 5_200,
        firstFileIndex: 1_201,
        lastFileIndex: 1500,
    } satisfies Props,
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {};
