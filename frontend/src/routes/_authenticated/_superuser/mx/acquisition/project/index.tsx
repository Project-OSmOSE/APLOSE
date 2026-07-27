import { createFileRoute } from '@tanstack/react-router'
import { Content } from '@/components/layout/Content';
import { Head } from '@/components/ui';
import { MxAcquisition } from '@/features/Mx';

export const Route = createFileRoute(
  '/_authenticated/_superuser/mx/acquisition/project/',
)({
  component: () => <Content oneContent>
      <Head title="Projects" canGoBack/>
      <MxAcquisition.ProjectCards/>
  </Content>,
})
