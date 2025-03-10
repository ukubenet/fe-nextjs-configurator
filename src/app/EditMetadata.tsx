"use client";

import EditMetadataForm from "@/app/EditMetadataForm";
import { API_ENDPOINTS, fetchApi } from "@/config/api";

import { Metadata } from "@/types/app";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Container, Link } from "@mui/material";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// const queryClient = new QueryClient();

// export default async function EditMetadataWithClient({ params }: { 
//   params: { appName: string; type: string; entityName: string }
// }) {

//   return (
//     <QueryClientProvider client={queryClient}>
//       <EditMetadata params={params} />
//       <ReactQueryDevtools initialIsOpen={false} />
//     </QueryClientProvider>
//   );
// };



function EditMetadata({
  params,
}: { 
  params: { appName: string, type: string, entityName: string }
}) {
  const { appName, type, entityName } = params;

  // const fetchData = async () => {
  //   const response = await fetchApi(API_ENDPOINTS.METADATA_ENTITY_GET(appName, type, entityName));

  //   const result = await response.json() as unknown as Metadata;
    
  //   result.attributes = Object.entries(result.attributes);
  
  //   return result;
  // };

  // const {data, isPending, error} = useQuery<Metadata>({ queryKey: ['edit_metadata', appName, type, entityName], queryFn: async () => await fetchData() })

  // if (isPending) return 'Loading...'

  // if (error) return 'An error has occurred: ' + error.message

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

