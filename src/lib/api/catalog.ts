const API_URL = process.env.API_URL;

export async function getAllCatalogEntities(appName: string, catalog: string) {
  console.log('appName:', appName, 'catalog:', catalog);
  const response = await fetch(
    `${API_URL}/v1/list/${appName}/catalog/${catalog}`,
    {
      next: { revalidate: 0 },
      cache: 'no-store',
      headers: {
        'Accept': 'application/json'
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch catalog details');
  }

  return await response.json();
}
