import { Container, Typography, Button } from '@mui/material'
import Link from 'next/link'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { getEntityMetadata } from '@/lib/api/entityMetadata'
import { EntityForm } from '@/components/apps/event/EntityForm'

export default async function NewEventPage({
  params,
}: {
  params: Promise<{ event: string, appName: string }>
}) {
  const { event, appName } = await params;
  const metadata = await getEntityMetadata(appName, 'event', event);

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
        New {decodeURIComponent(event)}
      </Typography>
      <div>
        <EntityForm 
            appName={appName}
            event={event}
            metadata={metadata}
        />
    </div>
    </Container>
  )
}
