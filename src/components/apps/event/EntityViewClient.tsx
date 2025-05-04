'use client'

import React from 'react'
import { 
  Box, 
  Button, 
  Paper,
  Typography,
  Divider,
  Stack
} from '@mui/material'
import { useRouter } from 'next/navigation'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import { format } from 'date-fns'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface EntityViewClientProps {
  appName: string
  event: string
  metadata: any
  referenceOptions: Record<string, any[]>
  eventData: Record<string, any>
}

export function EntityViewClient({ 
  appName, 
  event, 
  metadata, 
  referenceOptions,
  eventData 
}: EntityViewClientProps) {
  const router = useRouter()

  const renderFieldValue = (fieldName: string, fieldConfig: any, value: any) => {
    if (!value) return <Typography color="text.secondary">-</Typography>
    
    switch (fieldConfig.type) {
      case 'dateTime':
        try {
          return <Typography>{format(new Date(value), 'PPpp')}</Typography>
        } catch (e) {
          return <Typography>{value}</Typography>
        }
        
      case 'reference':
        if (typeof value === 'object' && value.type === 'reference' && value.view) {
          const viewFields = fieldConfig.view || []
          return (
            <Typography>
              {viewFields.map(field => value.view[field]).filter(Boolean).join(' - ')}
            </Typography>
          )
        }
        return <Typography>{JSON.stringify(value)}</Typography>
        
      default:
        return <Typography>{value}</Typography>
    }
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => router.push(`/apps/${appName}/run/event/${event}`)}
        >
          Back to List
        </Button>
        
        {!eventData.isClosed && (
          <Button 
            startIcon={<EditIcon />} 
            variant="contained"
            onClick={() => router.push(`/apps/${appName}/run/event/${event}/edit/${eventData.identifier}`)}
          >
            Edit
          </Button>
        )}
      </Box>
      
      <Typography variant="h5" gutterBottom>
        {decodeURIComponent(event)} Details
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Stack spacing={2}>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2}
          sx={{ py: 1 }}
        >
          <Box sx={{ width: { xs: '100%', sm: '25%' } }}>
            <Typography variant="subtitle2" color="text.secondary">ID</Typography>
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '75%' } }}>
            <Typography>{eventData.identifier}</Typography>
          </Box>
        </Stack>
        
        <Divider />
        
        {metadata?.attributes && Object.entries(metadata.attributes).map(([fieldName, fieldConfig]: [string, any]) => (
          <React.Fragment key={fieldName}>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2}
              sx={{ py: 1 }}
            >
              <Box sx={{ width: { xs: '100%', sm: '25%' } }}>
                <Typography variant="subtitle2" color="text.secondary">{fieldName}</Typography>
              </Box>
              <Box sx={{ width: { xs: '100%', sm: '75%' } }}>
                {renderFieldValue(fieldName, fieldConfig, eventData.attributes?.[fieldName])}
              </Box>
            </Stack>
            <Divider />
          </React.Fragment>
        ))}
        
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2}
          sx={{ py: 1 }}
        >
          <Box sx={{ width: { xs: '100%', sm: '25%' } }}>
            <Typography variant="subtitle2" color="text.secondary">Status</Typography>
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '75%' } }}>
            <Typography sx={{ 
              color: eventData.isClosed ? 'error.main' : 'success.main',
              fontWeight: 'bold'
            }}>
              {eventData.isClosed ? 'Closed' : 'Open'}
            </Typography>
          </Box>
        </Stack>
      </Stack>
      
      {metadata?.processor && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" gutterBottom>
            Event Processor
          </Typography>
          <Box sx={{ 
            mt: 2, 
            border: 1, 
            borderColor: 'grey.300', 
            borderRadius: 1, 
            overflow: 'hidden'
          }}>
            <SyntaxHighlighter 
              language="javascript" 
              style={vscDarkPlus}
              customStyle={{ margin: 0 }}
            >
              {metadata.processor || '// No processor code defined'}
            </SyntaxHighlighter>
          </Box>
        </>
      )}
    </Paper>
  )
}