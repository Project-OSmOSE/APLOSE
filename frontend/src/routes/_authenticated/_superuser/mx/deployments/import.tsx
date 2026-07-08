import { Mx } from '@/features/Mx'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
    '/_authenticated/_superuser/mx/deployments/import',
)({
    component: () => <Mx.DeploymentsImportForm/>,
})
