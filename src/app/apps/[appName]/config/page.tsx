
import AppConfigList from '@/components/config/AppConfigList'
import { API_ENDPOINTS, getSingleColumn } from '@/config/api'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {
  Box,
  Button,
  Container,
  Typography,
} from '@mui/material'
import Link from 'next/link'

export default async function AppPage({ 
  params 
}: { 
  params: Promise<{ appName: string }> 
}) {
  const resolvedParams = await params
  const catalogList = await getSingleColumn(API_ENDPOINTS.METADATA_LIST(resolvedParams.appName, "catalog"));
  const eventList = await getSingleColumn(API_ENDPOINTS.METADATA_LIST(resolvedParams.appName, "event"));
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          sx={{ mb: 4 }}
        >
          Back to Apps
        </Button>
      </Link>

      <Typography variant="h4" gutterBottom>
        {decodeURIComponent(resolvedParams.appName)}, CONFIG
      </Typography>

      <Box sx={{ mb: 8 }}>
      <Typography variant="h6" gutterBottom>
        Catalogs
      </Typography>
        <AppConfigList initialRows={catalogList} appName={resolvedParams.appName} entityType="catalog" />
      </Box>
      <Box sx={{ mb: 8 }}>
        <Typography variant="h6" gutterBottom>
          Events
        </Typography>
        <AppConfigList initialRows={eventList} appName={resolvedParams.appName} entityType="event" />
      </Box>
    </Container>
  )

}
