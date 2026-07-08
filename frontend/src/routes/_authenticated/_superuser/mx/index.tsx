import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/_superuser/mx/')({
    beforeLoad: () => {
        throw Route.redirect({ to: 'deployments' })
    },
})
