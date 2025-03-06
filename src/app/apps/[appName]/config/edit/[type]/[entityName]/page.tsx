
import EditMetadataForm from "@/app/EditMetadataForm";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Container, Link } from "@mui/material";


export default async function Edit({ params }: { 
  params: Promise<{ appName: string; type: string; entityName: string }>
}) {
  const {appName, type, entityName} = await params; // Resolve before passing

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
      
      <EditMetadataForm appName={appName} entityType={type} entityName={entityName} />
    
    </Container>
  );
}
