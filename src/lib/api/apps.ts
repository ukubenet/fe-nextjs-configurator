const API_URL = process.env.API_URL;

export async function getApp(appName: string) {
//   appName = 'Care Visit Tracker';
  const response = await fetch(`${API_URL}/v1/api/app/run/${appName}`, {
    cache: 'no-store',
    headers: {
        'Accept': 'application/json'
      }
  })
  if (!response.ok) {
    throw new Error('Failed to fetch app')
  }

  return await response.json()
}
