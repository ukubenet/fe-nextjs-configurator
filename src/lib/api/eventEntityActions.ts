'use server'

import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache'
import { API_ENDPOINTS, fetchApi } from '@/config/api'
import { getEntityMetadata } from './entityMetadata'
import { getEntityById } from './entityActions'

interface FormState {
    success: boolean;
    message: string | null;
  }
  
export async function saveEvent(appName: string, event: string, id?: string, prevState: FormState, formData: FormData) {
  try {
    const entityId = id || uuidv4();

    const payload: {
      entityName: string;
      entityType: number;
      identifier: string;
      attributes: Record<string, any>;
    } = {
      entityName: decodeURIComponent(event),
      entityType: 0,
      identifier: entityId,
      attributes: {}
    };

    // Process each form field
    for (const [key, value] of formData.entries()) {
      // Skip Next.js internal action fields
      if (key.startsWith('$ACTION_')) {
        continue;
      }

      if (typeof value === 'string') {
        try {
          // Try to parse as JSON (for reference fields)
          const parsedValue = JSON.parse(value);
          
          // If it has the reference field structure, it's a reference field
          if (parsedValue && parsedValue.type === 'reference' && parsedValue.reference && parsedValue.view) {
            payload.attributes[key] = parsedValue;
          } else {
            // Regular field that happened to be valid JSON
            payload.attributes[key] = value;
          }
        } catch (e) {
          // Not JSON, treat as regular field
          payload.attributes[key] = value;
        }
      } else {
        // Non-string values
        payload.attributes[key] = value;
      }
    }

    // Special handling for date fields
    for (const [key, value] of Object.entries(payload.attributes)) {
      // Check if this is a date field by looking for common date patterns
      if (
        typeof value === 'string' && 
        /^\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}\s[AP]M$/.test(value)
      ) {
        // Parse the date string (MM/DD/YYYY hh:mm AM/PM format)
        const dateParts = value.match(/^(\d{2})\/(\d{2})\/(\d{4})\s(\d{2}):(\d{2})\s([AP]M)$/);
        
        if (dateParts) {
          const [_, month, day, year, hours, minutes, ampm] = dateParts;
          
          // Convert hours to 24-hour format
          let hour = parseInt(hours, 10);
          if (ampm === 'PM' && hour < 12) hour += 12;
          if (ampm === 'AM' && hour === 12) hour = 0;
          
          // Format to ISO-like string: YYYY-MM-DDThh:mm
          payload.attributes[key] = `${year}-${month}-${day}T${hour.toString().padStart(2, '0')}:${minutes}`;
        }
      }
    }

    const response = await fetch(`${process.env.API_URL}/v1/entity/${appName}/event/${event}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      return {
        success: false, 
        message: errorData || 'Failed to create entity' 
      }
    }

    // Revalidate the path to refresh data
    revalidatePath(`/apps/${appName}/run/event/${event}`)
    
    return { success: true, message: 'Entity was saved successfully!' };
  } catch (error) {
    console.error('Error creating entity:', error)
    return { 
      success: false, 
      message: 'Failed to create entity. Please try again.' 
    }
  }
}

export async function closeEntity(appName: string, entityType: string, eventName: string, entityId: string) {
  try {
    // 1. Get the entity metadata (to access the processor code)
    const metadata = await getEntityMetadata(appName, entityType, eventName)
    console.log('Metadata:', metadata);
    // 2. Get the entity data
    const entityData = await getEntityById(appName, entityType, eventName, entityId)
    console.log('Entity Data:', entityData);
    // 3. Perform calculations using the processor code if available
    let calculationResults = {}
    if (metadata?.processor) {
      try {
        // Create a safe execution environment for the processor code
        const processorFunction = new Function('data', metadata.processor)
        calculationResults = processorFunction(entityData)
      } catch (processorError) {
        console.error('Error executing processor code:', processorError)
        throw new Error('Failed to execute processor code')
      }
    }
    
    // 4. Call the API to close the entity with calculation results
    const response = await fetchApi(
      API_ENDPOINTS.CLOSE_ENTITY(appName, entityType, eventName, entityId),
      {
        method: 'POST',
        body: JSON.stringify({
          calculationResults
        })
      }
    )
    
    if (!response.ok) {
      throw new Error('Failed to close entity')
    }
    
    // 5. Revalidate the path to refresh the data
    revalidatePath(`/apps/${appName}/run/event/${eventName}`)
    
    return { success: true, message: `${eventName} closed successfully` }
  } catch (error) {
    console.error('Error closing entity:', error)
    return { success: false, message: error instanceof Error ? error.message : 'An unknown error occurred' }
  }
}

export async function reopenEntity(appName: string, entityType: string, eventName: string, entityId: string) {
  try {
    const response = await fetchApi(
      API_ENDPOINTS.REOPEN_ENTITY(appName, entityType, eventName, entityId),
      {
        method: 'POST'
      }
    )
    
    if (!response.ok) {
      throw new Error('Failed to reopen entity')
    }
    
    revalidatePath(`/apps/${appName}/run/event/${eventName}`)
    
    return { success: true, message: `${eventName} reopened successfully` }
  } catch (error) {
    console.error('Error reopening entity:', error)
    return { success: false, message: error instanceof Error ? error.message : 'An unknown error occurred' }
  }
}