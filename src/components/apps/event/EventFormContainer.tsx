import { EntityFormClient } from './EntityFormClient'
import { getEntityMetadata } from '@/lib/api/entityMetadata'
import { getAllCatalogEntities } from '@/lib/api/catalog';

interface EventFormContainerProps {
  appName: string
  event: string
}

export async function EventFormContainer({ appName, event }: EventFormContainerProps) {
  const metadata = await getEntityMetadata(appName, 'event', event);
  
  const referenceOptions: Record<string, any[]> = {}

  if (metadata?.attributes) {
    const referenceAttrs = Object.entries(metadata.attributes)
      .filter(([_, value]: [string, any]) => value.type === 'reference')
    
    // Fetch all reference data in parallel
    await Promise.all(
      referenceAttrs.map(async ([key, value]: [string, any]) => {
        try {
          referenceOptions[key] = await getAllCatalogEntities(appName, (value as any).reference)
        } catch (error) {
          console.error(`Error fetching options for ${key}:`, error)
          referenceOptions[key] = []
        }
      })
    )
  }
  
  return (
    <EntityFormClient 
      appName={appName}
      event={event}
      metadata={metadata}
      referenceOptions={referenceOptions}
    />
  )
}
