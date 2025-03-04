"use client"
import MetadataForm from "@/app/MetadataForm";
import { API_ENDPOINTS, fetchApi } from "@/config/api";
import React, { useEffect } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import { Metadata } from "@/types/app";
import { Button, Container, Link } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const queryClient = new QueryClient();

export default function EditItem({
  params,
}: {
  params: { appName: string; type: string; entityName: string };
}) {
  const { appName, type, entityName } = React.use(params);

  return (
    <QueryClientProvider client={queryClient}>
      <EditMetadataForm params={{ appName, type, entityName }} />
    </QueryClientProvider>
  )
}

function EditMetadataForm({
  params,
}: {
  params: { appName: string; type: string; entityName: string };
}) {
  const { appName, type, entityName } = params;

  const { status, data, error } = useQuery({
    queryKey: ['metadata_entity_edit', appName, type, entityName],
    queryFn: async (): Promise<Metadata> => {
      const response = await fetchApi(API_ENDPOINTS.METADATA_ENTITY_GET(appName, type, entityName));
      if (!response) {
        throw new Error('Failed to fetch metadata');
      }
      return await response.json() as unknown as Metadata;
    }
  });  

  if (status === 'pending') {
    return <span>Loading...</span>
  }

  if (status === 'error') {
    return <span>Error: {error.message}</span>
  }

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
      <MetadataForm entityType={type} entity={data} mode="edit" />
    </Container>
  );
}
