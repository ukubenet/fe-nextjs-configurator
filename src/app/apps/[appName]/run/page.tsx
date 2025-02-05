import { getApp } from '@/lib/api/apps'
import { AppDetails } from '@/components/apps/AppDetails'

export default async function AppPage({ 
  params 
}: { 
  params: Promise<{ appName: string }> 
}) {
  const resolvedParams = await params
  const app = await getApp(resolvedParams.appName)
  return <AppDetails app={app} />
}
