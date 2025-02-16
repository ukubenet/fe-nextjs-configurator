import { Container, Typography, CircularProgress, Box } from '@mui/material';
import { getCatalogEntityMetadata } from '@/lib/api/catalogMetadata';
import { CatalogForm } from './CatalogForm';
import { Suspense } from 'react';

export default async function NewCatalogEntityPage({ 
  params,
}: { 
  params: Promise<{ catalog: string, appName: string }> 
}) {
  const { catalog, appName } = await params;
  const metadata = await getCatalogEntityMetadata(appName, catalog);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        New {metadata.entityName}
      </Typography>
      <Suspense fallback={
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      }>
        <CatalogForm 
          metadata={metadata}
          appName={appName}
          catalog={catalog}
        />
      </Suspense>
    </Container>
  )
}