import type { Preview } from '@storybook/tanstack-react/dist'

import '../src/css/base.css';
import { Toast } from '../src/components/base';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            staleTime: Infinity,
        },
    },
});

const preview: Preview = {
    beforeEach: () => {
        // 👇 Clear the cache between stories so each story starts fresh
        queryClient.clear();
    },
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },

        a11y: {
            // 'todo' - show a11y violations in the test UI only
            // 'error' - fail CI on a11y violations
            // 'off' - skip a11y checks entirely
            test: 'todo',
        },

        tanstack: {
            router: {
                context: { queryClient },
            },
        },
    },
    decorators: [
        (Story: any) => <Toast.Provider>
            <Story/>
        </Toast.Provider>,
        (Story: any) => <QueryClientProvider client={ queryClient }>
            <Story/>
        </QueryClientProvider>,
    ],
};

export default preview;