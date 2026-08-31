import { createFileRoute } from '@tanstack/react-router'
import { Content } from '@/components/layout/Content';
import { Head } from '@/components/ui';
import { Link } from '@/components/base';
import { Download } from '@solar-icons/react';

export const Route = createFileRoute(
    '/_authenticated/_superuser/mx/acquisition/',
)({
    component: () => (
        <Content oneContent>
            <Head title="Mx Acquisition" canGoBack/>

            <div>
                <Link to='/mx/acquisition/project'>Projects</Link>
                <Link to="/mx/acquisition/import-short-acquisitions">
                    <Download/>
                    Import short term acquisition
                </Link>
            </div>
        </Content>
    ),
})
