import { Toast } from './index.ts';
import type { Meta, StoryObj } from '@storybook/tanstack-react/dist';
import React, { Fragment, useEffect } from 'react';

const Test: React.FC = () => {
    const toastManager = Toast.useToastManager();
    useEffect(() => {
        toastManager.add({
            title: `Success toast created`,
            description: 'This is a toast notification.',
            timeout: 500_000,
            type: 'success'
        });
        toastManager.add({
            title: `Warning toast created`,
            description: 'This is a toast notification.This is a toast notification.This is a toast notification.This is a toast notification.This is a toast notification.',
            timeout: 500_000,
            type: 'warning'
        });
        toastManager.add({
            title: `Danger toast created`,
            description: 'This is a toast notification.',
            timeout: 500_000,
            type: 'danger'
        });
        toastManager.add({
            title: `Default toast created`,
            description: 'This is a toast notification.',
            timeout: 500_000,
        });
        toastManager.add({
            title: `Primary toast created`,
            description: 'This is a toast notification.',
            type: 'primary',
            timeout: 500_000,
        });
    }, []);
    return <Fragment/>
}

const meta = {
    title: 'Base/Toast',
    component: () => <Toast.Provider>
        <Test/>
    </Toast.Provider>,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: [ 'autodocs' ],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {},
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
    args: {},
} satisfies Meta<typeof Toast>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {};
