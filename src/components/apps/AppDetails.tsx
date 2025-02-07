'use client'

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

export function AppDetails({ app }: { app: App }) {
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
        {app.AppName}
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Catalogs
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {app.Catalogs.map((catalog) => (
                <TableRow key={catalog}>
                  <TableCell>{catalog}</TableCell>
                  <TableCell>
                    <Link href={`/apps/${app.AppName}/run/catalog/${catalog}`} passHref legacyBehavior>
                      <Button variant="contained">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Events
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {app.Events.map((event) => (
                <TableRow key={event}>
                  <TableCell>{event}</TableCell>
                  <TableCell>
                    <Link href={`/apps/1/run/event/${event}`} passHref legacyBehavior>
                      <Button variant="contained">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  )
}
