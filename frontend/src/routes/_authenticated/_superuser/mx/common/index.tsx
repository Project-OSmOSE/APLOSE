import { createFileRoute } from '@tanstack/react-router'
import { Content } from '@/components/layout/Content';
import { Head } from '@/components/ui';
import { Link } from '@/components/base';

export const Route = createFileRoute('/_authenticated/_superuser/mx/common/')({
  component: () => (
      <Content oneContent>
        <Head title='Mx Common' canGoBack/>

        <div>
          <Link to='/mx/common/institution'>Institution</Link>
          <Link to='/mx/common/team'>Team</Link>
          <Link to='/mx/common/person'>Person</Link>
        </div>
      </Content>
  )
})
