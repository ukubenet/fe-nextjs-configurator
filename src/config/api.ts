import { toast } from "react-toastify";

// export const 
// API_CONFIG = {
//   baseUrl: process.env.API_URL || 'http://localhost:4000',
//   endpoints: {
//     app: '/v1/api/app/',
//     duplicate: '/v1/api/app/duplicate/',
//   }
// };

const API_BASE_URL = process.env.API_URL || "http://localhost:4000";

export const API_ENDPOINTS = {
  APP: `${API_BASE_URL}/v1/api/app/`,
  APP_DUPLICATE: `${API_BASE_URL}/v1/api/app/duplicate/`,
  ATTRIBUTE_TYPES: `${API_BASE_URL}/v1/attribute-types`,
  METADATA_LIST: (appName: string, entityType: string) => `${API_BASE_URL}/v1/metadata/api/list/${appName}/${entityType}`,
  METADATA: (appName: string, entityType: string, entityName: string) => `${API_BASE_URL}/v1/metadata/api/${appName}/${entityType}/${entityName}`,
  METADATA_ENTITY_GET: (appName: string, entityType: string, entityName: string) => `${API_BASE_URL}/v1/metadata/api/get/${appName}/${entityType}/${entityName}`,
  METADATA_COPY: (appName: string, entityType: string, entityName: string) => `${API_BASE_URL}/v1/metadata/api/copy/${appName}/${entityType}/${entityName}`,
  METADATA_PUT: (appName: string, entityType: string) => `${API_BASE_URL}/v1/metadata/api/${appName}/${entityType}`,
}; 

export const fetchApi = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
}

export async function getSingleColumn(url: string) {
    const response = await fetchApi(url);
    if (!response) {
      return [];
    }
    let dataRows = await response?.json();
    if (!Array.isArray(dataRows)) {
      console.log("dataRows must be an array of objects.");
    }
    
    dataRows = dataRows.map((row: string) => {
      const newRow = {id: row};
      return newRow;
    });
    return dataRows;
}
