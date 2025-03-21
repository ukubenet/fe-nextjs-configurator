'use server'

import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache'

interface FormState {
    success: boolean;
    message: string | null;
  }
  
export async function createEvent(appName: string, event: string, id?: string, prevState: FormState, formData: FormData) {
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
