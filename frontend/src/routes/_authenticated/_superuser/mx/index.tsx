import { createFileRoute } from '@tanstack/react-router'
import { Content } from '@/components/layout/Content';
import { Head } from '@/components/ui';
import { Link } from '@/components/base';

export const Route = createFileRoute('/_authenticated/_superuser/mx/')({
    component: () => (
        <Content oneContent>
            <Head title='Metadatax'/>

            <div>
                <Link to='/mx/common'>Mx Common</Link>
            </div>
        </Content>
    )
})
