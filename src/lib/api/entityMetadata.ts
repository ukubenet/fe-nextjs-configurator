const API_URL = process.env.API_URL;

export async function getEntityMetadata(appName: string, type: string, entityName: string) {
    // appName = "Care Visit Tracker";
    const response = await fetch(
      `${API_URL}/v1/metadata/api/get/${appName}/${type}/${entityName}`,
      {
        next: { revalidate: 0 },
        cache: 'no-store',
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    if (response.status !== 302) {
      throw new Error('Failed to fetch catalog entity metadata');
    }
  
    return await response.json();
  }
  