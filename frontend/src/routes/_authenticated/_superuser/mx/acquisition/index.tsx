import { createFileRoute } from '@tanstack/react-router'
import { Content } from '@/components/layout/Content';
import { Head } from '@/components/ui';

export const Route = createFileRoute('/_authenticated/_superuser/mx/acquisition/')({
    component: () => (
        <Content oneContent>
            <Head title="Mx Acquisition" canGoBack/>

            <div>
                {/*<Link to='/mx/common/institution'>Institution</Link>*/ }
            </div>
        </Content>
    ),
})
