import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute(
    '/_authenticated/annotation-campaign',
)({
    loader: async ({ parentMatchPromise }) => (await parentMatchPromise).loaderData!,
    component: Outlet
})
