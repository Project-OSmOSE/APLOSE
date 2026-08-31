import { createFileRoute } from '@tanstack/react-router'
import { Head } from '@/components/ui';
import { Content } from '@/components/layout/Content';
import { MxAcquisition } from '@/features/Mx'

export const Route = createFileRoute(
    '/_authenticated/_superuser/mx/acquisition/import-short-acquisitions',
)({
    component: () => <Content oneContent>
        <Head canGoBack title="Import short term acquisition"/>
        <MxAcquisition.ImportShortAcquisitionForm/>
    </Content>,
})
