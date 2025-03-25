import { Container, Typography, CircularProgress, Box } from '@mui/material';
import { getEntityMetadata } from '@/lib/api/entityMetadata';
import { getEntityById } from '@/lib/api/entityActions';
import { CatalogForm } from '../../new/CatalogForm';
import { Suspense } from 'react';

export default async function EditCatalogEntityPage({ 
  params,
}: { 
  params: Promise<{ catalog: string, appName: string, id: string }> 
}) {
  const { catalog, appName, id } = await params;
  const metadata = await getEntityMetadata(appName, 'catalog', catalog);
  const entityData = await getEntityById(appName, 'catalog', catalog, id);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Edit {metadata.entityName}
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
          initialData={entityData}
        />
      </Suspense>
    </Container>
  )
}