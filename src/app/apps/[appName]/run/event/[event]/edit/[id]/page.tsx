import { Suspense } from 'react'
import { Container, Typography, CircularProgress } from '@mui/material'
import { EventFormContainer } from '@/components/apps/event/EventFormContainer'

interface EditEventPageProps {
    params: Promise<{
      appName: string
      event: string
      id: string
    }>
  }

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { appName, event, id } = await params
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Edit {decodeURIComponent(event)}
      </Typography>
      <Suspense fallback={<CircularProgress />}>
        <EventFormContainer 
          appName={appName}
          event={event}
          entityId={id}
        />
      </Suspense>
    </Container>
  )
}