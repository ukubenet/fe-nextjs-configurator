'use client'

import { useState, useEffect } from 'react'
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Paper,
  Stack,
  CircularProgress 
} from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { useRouter } from 'next/navigation'

interface EntityFormClientProps {
  appName: string
  event: string
  metadata: any
  referenceOptions: Record<string, any[]>
}

export function EntityFormClient({ 
  appName, 
  event, 
  metadata, 
  referenceOptions 
}: EntityFormClientProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [submitting, setSubmitting] = useState(false)
  
  // Initialize form data with default values
  useEffect(() => {
    const initialData: Record<string, any> = {}
    
    if (metadata?.attributes) {
      Object.entries(metadata.attributes).forEach(([key, value]: [string, any]) => {
        if (value.type === 'dateTime') {
          initialData[key] = new Date()
        } else if (value.type === 'number') {
          initialData[key] = 0
        } else if (value.type === 'reference') {
          initialData[key] = ''
        } else {
          initialData[key] = ''
        }
      })
    }
    
    setFormData(initialData)
  }, [metadata])
  
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      const response = await fetch(`/api/apps/${appName}/event/${event}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create entity')
      }
      
      // Redirect back to the list page
      router.push(`/apps/${appName}/run/event/${event}`)
    } catch (error) {
      console.error('Error creating entity:', error)
      alert('Failed to create entity. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }
  
  const renderFormField = (fieldName: string, fieldConfig: any) => {
    switch (fieldConfig.type) {
      case 'dateTime':
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label={fieldName}
              value={formData[fieldName]}
              onChange={(newValue) => handleInputChange(fieldName, newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        )
        
      case 'number':
        return (
          <TextField
            label={fieldName}
            type="number"
            fullWidth
            value={formData[fieldName]}
            onChange={(e) => handleInputChange(fieldName, Number(e.target.value))}
          />
        )
        
      case 'reference':
        return (
          <FormControl fullWidth>
            <InputLabel id={`${fieldName}-label`}>{fieldName}</InputLabel>
            <Select
              labelId={`${fieldName}-label`}
              value={formData[fieldName]}
              label={fieldName}
              onChange={(e) => handleInputChange(fieldName, e.target.value)}
              sx={{ minWidth: 250 }}
            >
              <MenuItem value="" disabled>
                <em>Please select a {fieldName}...</em>
              </MenuItem>
              {referenceOptions[fieldName]?.map((item, index) => (
                <MenuItem key={index} value={item.id || item.identifier}>
                  {fieldConfig.view.map((viewField: string) => 
                    item[viewField] || item.attributes?.[viewField]
                  ).filter(Boolean).join(' - ')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )
        
      default:
        return (
          <TextField
            label={fieldName}
            fullWidth
            value={formData[fieldName]}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
          />
        )
    }
  }
  
  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Add New {decodeURIComponent(event)}
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ maxWidth: '600px', mx: 'auto' }}>
        <Stack spacing={3} width="100%">
          {metadata?.attributes && Object.entries(metadata.attributes).map(([fieldName, fieldConfig]: [string, any]) => (
            <Box key={fieldName} width="100%">
              {renderFormField(fieldName, fieldConfig)}
            </Box>
          ))}
          
          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <Button 
              variant="outlined" 
              onClick={() => router.push(`/apps/${appName}/run/event/${event}`)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={submitting}
            >
              {submitting ? <CircularProgress size={24} /> : 'Save'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  )
}
