import { Note, NoteProps } from './index.tsx';
import type { Meta, StoryObj } from '@storybook/tanstack-react/dist';
import type { BaseColor } from '@/components/base/types';
import { Fragment } from 'react';
import { AltArrowRight, InfoCircle } from '@solar-icons/react';
import { Link } from '../Button/Link.tsx';

const meta = {
    title: 'Base/Note',
    component: Note,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'padded',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: [ 'autodocs' ],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        color: {
            control: { type: 'radio' },
            options: [ 'default', 'medium', 'primary', 'warning', 'danger' ] as BaseColor[],
            type: 'BaseColor',
        },
        children: {
            type: 'ReactNode',
        },
    } satisfies Partial<Record<keyof NoteProps, any>>,
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
    args: {
        color: 'medium',
        children: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    } satisfies NoteProps,
} satisfies Meta<typeof Note>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {};

export const Paragraph: Story = {
    args: {
        color: 'medium',
        children: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam vitae metus in ante fermentum facilisis. Vestibulum mattis placerat tortor, ut maximus neque. Ut ac augue ac dui finibus pellentesque volutpat non dolor. Aliquam consectetur lorem at nibh laoreet ultricies. Duis rutrum eros in blandit sodales. Morbi in velit non justo convallis suscipit a sed elit. Ut ultricies viverra mollis. Sed ante purus, ultricies quis augue vel, feugiat lacinia ipsum. Aliquam ac ante sollicitudin, ornare ex sit amet, ultricies libero. Duis vel posuere ex. Vivamus venenatis id justo in dictum. Aliquam varius luctus risus, eget faucibus quam pulvinar ut. Cras vitae condimentum mi. Phasellus porttitor augue ac molestie tempor.',
    } satisfies NoteProps,
};

export const Icon: Story = {
    args: {
        color: 'medium',
        children: <AltArrowRight weight="Linear" size={ 20 }/>,
    } satisfies NoteProps,
};

export const IconAndLink: Story = {
    args: {
        color: 'medium',
        children: <Fragment>
            <InfoCircle weight="Linear"/> You can import new datasets in the <Link inText
                                                                                   to="/storage">Storage</Link> section
        </Fragment>,
    } satisfies NoteProps,
};

export const List: Story = {
    args: {
        color: 'medium',
        children: <Fragment>
            Are available for import:
            <ul>
                <li>Datasets made with the legacy OSEkit (v{ '<' }0.2.5)</li>
                <li>Dataset and SpectroDataset analysis made with current OSEkit version</li>
            </ul>
        </Fragment>,
    } satisfies NoteProps,
};
