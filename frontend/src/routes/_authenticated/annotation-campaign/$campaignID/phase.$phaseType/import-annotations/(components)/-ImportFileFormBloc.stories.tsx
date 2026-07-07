import { ImportFileFormBloc, type ImportFileFormBlocProps } from './-ImportFileFormBloc.tsx';
import type { Meta, StoryObj } from '@storybook/tanstack-react/dist';
// @ts-expect-error: using different ts-config: moduleResolution (see tsconfig.storybook.json)
import { mocked } from 'storybook/test';
import { useLoaderData } from '@tanstack/react-router';

const meta = {
    title: 'pages/ImportAnnotations/ImportFileFormBloc',
    component: ImportFileFormBloc,
    decorators: [
        (Story: any) => {
            mocked(useLoaderData).mockReturnValue({
                campaign: {
                    dataset: {
                        name: 'Storybook',
                    },
                },
            })
            return <Story/>
        },
    ],
    parameters: { layout: 'centered' },
    tags: [ 'autodocs' ],
    args: {
        onLoaded: console.debug,
        onReset: console.debug
    } satisfies Partial<ImportFileFormBlocProps>
} satisfies Meta<typeof ImportFileFormBloc>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};