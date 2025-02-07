export async function getCatalogEntityMetadata(appName: string, catalog: string) {
    // appName = "Care Visit Tracker";
    const response = await fetch(
      `http://127.0.0.1:4000/v1/metadata/api/get/${appName}/catalog/${catalog}`,
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
  