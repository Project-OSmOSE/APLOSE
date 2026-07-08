import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
    '/_authenticated/_superuser/mx/deployments/',
)({
    beforeLoad: () => {
        throw Route.redirect({ to: 'import' })
    },
})
