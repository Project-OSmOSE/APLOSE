import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute(
    '/_authenticated/annotation-campaign',
)({ component: Outlet })
