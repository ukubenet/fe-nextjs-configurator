import { Container, Typography } from '@mui/material'
import { EventViewContainer } from '@/components/apps/event/EventViewContainer'
import { NotificationHandler } from '@/components/utils/NotificationHandler'

interface EventViewPageProps {
    params: Promise<{
      appName: string
      event: string
      id: string
    }>
  }

export default async function EventViewPage({ params }: EventViewPageProps) {
  const { appName, event, id } = await params;
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <NotificationHandler />
      <Typography variant="h4" gutterBottom>
        View details of {decodeURIComponent(event)}
      </Typography>
      <EventViewContainer 
        appName={appName}
        event={event}
        entityId={id}
      />
    </Container>
  )
}
