"use client";
import MetadataForm from "@/app/MetadataForm";
import React, { useEffect } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import Link from 'next/link';
import { Button, Container } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Metadata } from "@/types/app";


export default function AddItem({
  params,
}: {
  params: { appName: string; type: string };
}) {
  const { appName, type } = React.use(params);

  return (
      <AddMetadataForm params={{ appName, type }} />
  )
}



function AddMetadataForm({
  params,
}: {
  params: { appName: string; type: string };
}) {
  const { appName, type } = params;

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
      <MetadataForm entityType={type} entity={{entityName: "", attributes: new Map()}} mode="add" />
    </Container>
  );
}
