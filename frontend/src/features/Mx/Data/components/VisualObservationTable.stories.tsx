import type { Meta, StoryObj } from '@storybook/tanstack-react/dist';
import { Dialog } from '@/components/base';
import { VisualObservationTable } from './VisualObservationTable.tsx';

const meta = {
    title: 'Mx/Acquisition/VisualObservationTable',
    component: ({ info }: { info: string }) => (
        <VisualObservationTable obs={ [
            {
                source: {
                    displayName: 'Stripped dolphin',
                },
                otherHumanActivityPresence: true,
                youngPresence: false,
                behaviors: [
                    { name: 'eat' },
                    { name: 'sleep' },
                    { name: 'rest' },
                    { name: 'mate' }
                ],
                reactionsToBoat: [
                    { name: 'avoid the boat' },
                ],
                startDatetime: new Date().toISOString(),
                endDatetime: new Date().toISOString(),
                additionalInformation: info,
                countMin: 10,
                countMax: 50,
                startDistanceMin: 10,
                startDistanceMax: 100,
                endDistanceMin: 1000,
                endDistanceMax: null,
            }
        ] }/>
    ),
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
        info: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In semper facilisis tortor nec venenatis. Nulla a feugiat lectus. Duis tortor enim, hendrerit quis lacus in, aliquet scelerisque arcu. Pellentesque consectetur faucibus aliquam. In a pretium augue. Phasellus non sem lacinia, convallis neque non, vulputate nibh. In blandit cursus libero, sed gravida augue rhoncus in. Suspendisse potenti. Sed posuere massa et urna dapibus, sit amet gravida turpis placerat. Aliquam vulputate gravida fringilla. Curabitur sit amet sapien non metus gravida ornare. Nulla facilisi. Fusce id arcu quis purus venenatis lacinia. Aenean vehicula nisi vitae dolor accumsan tristique. Integer sapien magna, venenatis ut tincidunt non, maximus eu lacus. Maecenas eget varius nisi.\n' +
            '\n' +
            'In hac habitasse platea dictumst. Etiam viverra, risus mollis auctor dictum, lacus tellus lobortis nunc, id consequat nunc magna at lorem. Vestibulum massa libero, tempor egestas pulvinar sit amet, vestibulum nec nunc. Etiam tristique elit tellus, a imperdiet mi molestie ut. Duis lobortis magna quis eros sodales, id ultrices purus venenatis. Maecenas fringilla risus erat, ac ultrices nisi consectetur ac. Vivamus vel enim eu nunc eleifend porttitor. Suspendisse in dolor nulla. Vivamus porta imperdiet tellus. Donec sit amet auctor orci. Curabitur id molestie nibh. Ut vitae ultricies tortor, sed euismod elit.'
    },
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {};
