const API_URL = process.env.API_URL;

export async function getAllEventEntities(appName: string, event: string) {
  console.log('appName:', appName, 'event:', event);
  const response = await fetch(
    `${API_URL}/v1/list/${appName}/event/${event}`,
    {
      next: { revalidate: 0 },
      cache: 'no-store',
      headers: {
        'Accept': 'application/json'
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch event entities');
  }

  return await response.json();
}
