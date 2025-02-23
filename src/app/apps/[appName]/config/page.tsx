
import { getApp } from '@/lib/api/apps'
import { 
  Container, 
  Typography, 
  Button,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Link from 'next/link'
import type { App } from '@/types/app'
import {  
  Box, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material'
import EntityActions from '../../../../components/apps/EntityActions';
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react'
import AppConfigList from '@/app/AppConfigList'
import { API_ENDPOINTS, getSingleColumn } from '@/config/api'

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
        {resolvedParams.appName}, CONFIG
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
        <AppConfigList initialRows={catalogList} appName={resolvedParams.appName} entityType="event" />
      </Box>
    </Container>
  )

}
