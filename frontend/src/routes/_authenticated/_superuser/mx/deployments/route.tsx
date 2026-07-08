import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute(
    '/_authenticated/_superuser/mx/deployments',
)({
    component: Outlet,
})
