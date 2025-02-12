import { 
  Container, 
  Typography, 
  Box, 
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Link from 'next/link'
import type { App } from '@/types/app'
import { EntityListTable } from './EntityListTable'

export function AppDetails({ app, mode }: { app: App, mode: string }) {
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
        {app.AppName}, MODE: {mode}
      </Typography>

      <EntityListTable
        appName={app.AppName}
        entityType="catalog"
        mode={mode}
        list={app.Catalogs}
      />
      <EntityListTable
        appName={app.AppName}
        entityType="event"
        mode={mode}
        list={app.Events}
      />
    </Container>
  )
}