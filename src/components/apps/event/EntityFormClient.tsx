'use client'

import { useState, useEffect, useActionState } from 'react'
import { 
  Box, 
  Button, 
  TextField, 
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
import { saveEvent } from '@/lib/api/eventEntityActions'
import { useNotification } from '@/contexts/NotificationContext';

interface EntityFormClientProps {
  appName: string
  event: string
  metadata: any
  referenceOptions: Record<string, any[]>
  initialData?: Record<string, any>
}
interface FormState {
  success: boolean;
  message: string;
}

export function EntityFormClient({ 
  appName, 
  event, 
  metadata, 
  referenceOptions,
  initialData 
}: EntityFormClientProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)  
  const { setNotification } = useNotification();

  const initialState: FormState = {
    success: false,
    message: ''
  };
  const [state, formAction] = useActionState(saveEvent.bind(null, appName, event, initialData?.identifier), initialState);

  useEffect(() => {
    if (state.success) {
      setNotification(state.message, 'success');
      router.push(`/apps/${appName}/run/event/${event}`);
    }
  }, [state]);

  const getInitialValue = (fieldName: string, fieldConfig: any) => {
    if (!initialData || !initialData.attributes) return '';
    
    const value = initialData.attributes[fieldName];
    
    // Handle reference type fields
    if (fieldConfig.type === 'reference' && value) {
      // If the value is already a string, return it
      if (typeof value === 'string') return value;
      
      // Otherwise, create the reference object string
      const viewData: Record<string, string> = {};
      fieldConfig.view.forEach((viewField: string) => {
        viewData[viewField] = value.view?.[viewField] || '';
      });
      
      return JSON.stringify({
        reference: value.reference,
        type: "reference",
        view: viewData
      });
    }
    
    return value || '';
  };

  const renderFormField = (fieldName: string, fieldConfig: any) => {
    const initialValue = getInitialValue(fieldName, fieldConfig);

    switch (fieldConfig.type) {
      case 'dateTime':
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label={fieldName}
              name={fieldName}
              defaultValue={initialValue ? new Date(initialValue) : null}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        )
        
      case 'number':
        return (
          <TextField
            label={fieldName}
            name={fieldName}
            type="number"
            defaultValue={initialValue}
            fullWidth
          />
        )
        
      case 'reference':
        return (
          <FormControl fullWidth>
            <InputLabel id={`${fieldName}-label`}>{fieldName}</InputLabel>
            <Select
              labelId={`${fieldName}-label`}
              name={fieldName}
              label={fieldName}
              defaultValue={initialValue}
              sx={{ minWidth: 250 }}
            >
              <MenuItem value="" disabled>
                <em>Please select a {fieldName}...</em>
              </MenuItem>
              {referenceOptions[fieldName]?.map((item, index) => {
                // Create view object with the required structure
                const viewData: Record<string, string> = {};
                fieldConfig.view.forEach((viewField: string) => {
                  viewData[viewField] = item[viewField] || item.attributes?.[viewField];
                });
                
                // Create the full reference object
                const referenceValue = JSON.stringify({
                  reference: item.id || item.identifier,
                  type: "reference",
                  view: viewData
                });
                
                return (
                  <MenuItem key={index} value={referenceValue}>
                    {fieldConfig.view.map((viewField: string) => 
                      item[viewField] || item.attributes?.[viewField]
                    ).filter(Boolean).join(' - ')}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        )
        
      default:
        return (
          <TextField
            label={fieldName}
            name={fieldName}
            fullWidth
          />
        )
    }
  }
  
  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Box component="form" action={formAction} noValidate sx={{ maxWidth: '600px', mx: 'auto' }}>
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
