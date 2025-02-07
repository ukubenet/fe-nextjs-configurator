import { Container, Typography } from '@mui/material';
import { getCatalogEntityMetadata } from '@/lib/api/catalogMetadata';
import { CatalogForm } from './CatalogForm';

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
      <CatalogForm 
        metadata={metadata}
        appName={appName}
        catalog={catalog}
      />
    </Container>
  )
}