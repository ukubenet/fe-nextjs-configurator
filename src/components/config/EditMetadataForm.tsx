"use client"
import { API_ENDPOINTS, fetchApi } from '@/config/api';
import { Metadata } from '@/types/app';
import {
  Paper,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import { QueryClient } from '@tanstack/react-query';
import MetadataForm from './MetadataForm';
const queryClient = new QueryClient();

function EditMetadataForm({ appName, entityType, entityName, attributeTypes }: { appName: string; entityType: string, entityName: string, attributeTypes: string[] }) {
  
  const [entity, setEntity] = useState(null as unknown as Metadata);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchApi(API_ENDPOINTS.METADATA_ENTITY_GET(appName, entityType, entityName));

        const result = await response.json() as unknown as Metadata;
        
        result.attributes = Object.entries(result.attributes);
        setEntity(result);
        console.log(result);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };        
    fetchData();
  }, 
  [appName, entityType, entityName]); // Added dependencies

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  
  const handleEntityNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEntity(prev => ({
      ...prev,
      entityName: value
    }));
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Edit {entityType}
      </Typography>
      <MetadataForm appName={appName} entityType={entityType} attributeTypes={attributeTypes} setEntity={setEntity} entity={entity} mode="edit" />
    </Paper>
  );
}


export default EditMetadataForm;