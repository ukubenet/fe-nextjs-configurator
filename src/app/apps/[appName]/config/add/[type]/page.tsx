
import AddMetadataForm from "@/app/AddMetadataForm";
import { API_ENDPOINTS, fetchApi } from "@/config/api";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Container, Link } from "@mui/material";


export default async function Add({ params }: { 
  params: Promise<{ appName: string; type: string; entityName: string }>
}) {
  const {appName, type} = await params; // Resolve before passing

  const attributeTypes = await fetchApi(API_ENDPOINTS.ATTRIBUTE_TYPES).then(res => res.json());

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Link href={`/apps/${appName}/config`} style={{ textDecoration: 'none' }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          sx={{ mb: 4 }}
        >
          Back to App Config
        </Button>
      </Link>
      
      <AddMetadataForm appName={appName} entityType={type} attributeTypes={attributeTypes} />
    
    </Container>
  );
}