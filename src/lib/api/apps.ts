export async function getApp(appName: string) {
//   appName = 'Care Visit Tracker';
  const response = await fetch(`http://127.0.0.1:4000/v1/api/app/run/${appName}`, {
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
