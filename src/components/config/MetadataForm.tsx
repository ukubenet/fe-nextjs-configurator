"use client"
import { Metadata } from '@/types/app';

import {
  Box,
  Button,
  TextField,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import MetadataAttributes from './MetadataAttributes';
import { AppProvider } from './AppContext';
import { API_ENDPOINTS, fetchApi } from '@/config/api';
import { useRouter } from 'next/navigation';
import Editor from '@monaco-editor/react';

function MetadataForm({ appName, entityType, attributeTypes, setEntity, entity, mode }: { 
  appName: string; 
  entityType: string, 
  attributeTypes: string[], 
  setEntity: React.Dispatch<React.SetStateAction<any>>, 
  entity: Metadata,
  mode: 'add' | 'edit'
}) {
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
    
  const handleEntityNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEntity(prev => ({
      ...prev,
      entityName: value
    }));
  };

  const handleProcessorChange = (value: string | undefined) => {
    setEntity(prev => ({
      ...prev,
      processor: value || ""
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setError("");
    try {
      const updatedEntity = {
        ...entity,
        attributes: Object.fromEntries(entity.attributes),
      };
      const response = await fetchApi(
        API_ENDPOINTS.METADATA_PUT(appName, entityType), 
        {
          method: 'PUT',
          body: JSON.stringify(updatedEntity),
        }
      );
      if (!response.ok) {
        throw new Error('Failed to update entity');
      }
      setSuccessMessage('Entity updated successfully');
      setTimeout(() => {
        router.push(`/apps/${appName}/config`);
      }, 1000);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <AppProvider appName={appName}>
      {successMessage !== '' && <Typography color="success.main">{successMessage}</Typography>}
      {error && <Typography color="error.main">{error}</Typography>}
      <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Entity Name"
            value={entity.entityName}
            onChange={handleEntityNameChange}
            margin="normal"
            disabled={mode === 'edit'}
          />
          <MetadataAttributes 
              attributes={entity.attributes}
              setEntity={setEntity}
              entity={entity}
              attributeTypes={attributeTypes}
          /> 
          {entityType === "event" && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Processor Code
              </Typography>
              <Box sx={{ border: 1, borderColor: 'grey.300', borderRadius: 1, overflow: 'hidden' }}>
                <Editor
                  height="300px"
                  defaultLanguage="javascript"
                  value={entity.processor || ""}
                  onChange={handleProcessorChange}
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                  }}
                />
              </Box>
            </Box>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            id="submitButton"
          >
            Save
          </Button>
      </Box>
    </AppProvider>
  );
}
export default MetadataForm;