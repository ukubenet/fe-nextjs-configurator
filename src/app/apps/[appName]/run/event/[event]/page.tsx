import { Container, Typography } from '@mui/material'

export default async function EventPage({
  params,
}: {
  params: { event: string }
}) {
  const { event } = params

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Event: {event}
      </Typography>
      <Typography>
        This page could show details or run configurations for the event: {event}
      </Typography>
    </Container>
  )
}
