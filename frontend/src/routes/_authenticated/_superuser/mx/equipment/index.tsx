import { createFileRoute } from '@tanstack/react-router'
import { Content } from '@/components/layout/Content';
import { Head } from '@/components/ui';
import { Link } from '@/components/base';

export const Route = createFileRoute('/_authenticated/_superuser/mx/equipment/')({
    component: () => (
        <Content oneContent>
            <Head title="Mx Equipment" canGoBack/>

            <div>
                <Link to="/mx/equipment/platform_type">Platform types</Link>
                <Link to="/mx/equipment/platform">Platform</Link>
                <Link to="/mx/equipment/equipment-model">Equipment model</Link>
                <Link to="/mx/equipment/equipment">Equipment</Link>
            </div>
        </Content>
    ),
})
