import { EntityViewClient } from '@/components/apps/event/EntityViewClient'
import { getEntityMetadata } from '@/lib/api/entityMetadata'
import { getAllCatalogEntities } from '@/lib/api/catalog';
import { getAllEventEntities } from '@/lib/api/event';
import { getEntityById } from '@/lib/api/entityActions'

interface EventViewContainerProps {
  appName: string
  event: string
  entityId: string
}

export async function EventViewContainer({ appName, event, entityId }: EventViewContainerProps) {
  const metadata = await getEntityMetadata(appName, 'event', event);
  const eventData = await getEntityById(appName, 'event', event, entityId);
  
  const referenceOptions: Record<string, any[]> = {}

  if (metadata?.attributes) {
    const referenceAttrs = Object.entries(metadata.attributes)
      .filter(([_, value]: [string, any]) => value.type === 'reference')
    
    // Fetch all reference data in parallel
    await Promise.all(
      referenceAttrs.map(async ([key, value]: [string, any]) => {
        try {
          if (value.referenceType === 'catalog') {
            referenceOptions[key] = await getAllCatalogEntities(appName, (value as any).reference)
          } else if (value.referenceType === 'event') {
            referenceOptions[key] = await getAllEventEntities(appName, (value as any).reference)
          } else {
            referenceOptions[key] = []
          }
        } catch (error) {
          console.error(`Error fetching options for ${key}:`, error)
          referenceOptions[key] = []
        }
      })
    )
  }
  
  return (
    <EntityViewClient 
      appName={appName}
      event={event}
      metadata={metadata}
      referenceOptions={referenceOptions}
      eventData={eventData}
    />
  )
}