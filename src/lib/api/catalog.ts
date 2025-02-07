export async function getAllCatalogEntities(appName: string, catalog: string) {
  console.log('appName:', appName, 'catalog:', catalog);
  const response = await fetch(
    `http://127.0.0.1:4000/v1/list/${appName}/catalog/${catalog}`,
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
