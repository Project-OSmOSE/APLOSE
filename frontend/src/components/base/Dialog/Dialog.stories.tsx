import { Dialog } from './index.ts';
import type { Meta, StoryObj } from '@storybook/tanstack-react/dist';
import { type ReactNode } from 'react';
import { Form } from '@/components/base/Form';
import { Button, HelpButton } from '@/components/base/Button';
// @ts-expect-error: using different ts-config: moduleResolution (see tsconfig.storybook.json)
import { fn } from 'storybook/test';
import { Field } from '../Field/index.ts';
import { Magnifer } from '@solar-icons/react';
import { Note } from '@/components/base/Note';


type Props = {
    content: ReactNode,
}
const meta = {
    title: 'Base/Dialog',
    component: ({ content }: Props) => (
        <Dialog.Root>
            <Dialog.Trigger>
                Open me
            </Dialog.Trigger>
            { content }
        </Dialog.Root>
    ),
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'padded',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: [ 'autodocs' ],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {} satisfies Partial<Record<keyof Props, any>>,
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
    args: {
        content: <Dialog.Content>
            <Dialog.Title>Lorem ipsum</Dialog.Title>
            <Dialog.Close/>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Dialog.Content>,
    } satisfies Props,
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {};

export const StorageSearch: Story = {
        args: {
            content: <Dialog.Content>
                <Dialog.Title>Search path</Dialog.Title>
                <Dialog.Close/>

                <Form horizontal
                      onSubmit={ event => {
                          event.preventDefault()
                          return fn
                      } }>
                    <Field.Root name="search">
                        <Field.Control startIcon={ Magnifer }
                                       placeholder="Enter exact path"
                                       type="text"/>
                        <Field.Error/>
                    </Field.Root>

                    <Button color="primary" type="submit">Search</Button>
                </Form>

                <Note color="medium">
                    You can search for the exact path of:
                    <ul>
                        <li>a common folder</li>
                        <li>a dataset folder</li>
                        <li>an OSEkit dataset.json file describing a dataset</li>
                    </ul>
                </Note>

                <HelpButton url="/doc/user/data/generate">
                    How to generate a dataset
                </HelpButton>
            </Dialog.Content>,
        },
    }
;
