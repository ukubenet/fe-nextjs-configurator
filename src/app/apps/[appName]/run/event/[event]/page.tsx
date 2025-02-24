import { Container, Typography, Button } from '@mui/material'
import { EventItem } from '@/types/app'
import { getAllEventEntities } from '@/lib/api/event'
import Link from 'next/link'
import { NotificationHandler } from '@/components/utils/NotificationHandler'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { EntityList } from '@/components/apps/event/EntityList'

export default async function EventPage({
  params,
}: {
  params: Promise<{ event: string, appName: string }>
}) {
  const { event, appName } = await params;
  const eventEntities: EventItem[] = await getAllEventEntities(appName, event);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <NotificationHandler />
      <Link href={`/apps/${appName}/run`} style={{ textDecoration: 'none' }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          sx={{ mb: 4 }}
        >
          Back to App Run
        </Button>
      </Link>
      <Typography variant="h4" gutterBottom>
        Event: {decodeURIComponent(event)}
      </Typography>
      
      <EntityList 
        appName={appName}
        event={event}
        eventEntities={eventEntities}
      />
    </Container>
  )
}