import { Container, Typography, Button } from '@mui/material'
import Link from 'next/link'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { EventFormContainer } from '@/components/apps/event/EventFormContainer'

interface NewEventPageProps {
    params: Promise<{
      appName: string
      event: string
    }>
  }

export default async function NewEventPage({ params }: NewEventPageProps) {
  const { appName, event } = await params;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Link href={`/apps/${appName}/run/event/${event}`} style={{ textDecoration: 'none' }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          sx={{ mb: 4 }}
        >
          Back to Events
        </Button>
      </Link>
      <Typography variant="h4" gutterBottom>
        Add New {decodeURIComponent(event)}
      </Typography>
      
      <EventFormContainer 
        appName={appName}
        event={event}
      />
    </Container>
  )
}
