'use server'

import { redirect } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

const API_URL = process.env.API_URL;

export async function createEntity(appName: string, catalog: string, formData: FormData) {
  try {
    const data = Object.fromEntries(formData);
    const entityId = uuidv4();

    const response = await fetch(`${API_URL}/v1/entity/${appName}/catalog/${catalog}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        entityName: catalog,
        entityType: 0,
        identifier: entityId,
        attributes: data,
        transactions: null
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create entity: ${errorData.message}`);
    }
  } catch (error) {
    console.log("Server Error: ", error);
  }
  
  redirect(`/apps/${appName}/run/catalog/${catalog}`);
}
