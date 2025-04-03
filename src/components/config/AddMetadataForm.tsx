"use client"
import { Metadata } from '@/types/app';


import {
  Box,
  Button,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import MetadataAttributes from './MetadataAttributes';
import { AppProvider } from './AppContext';
import MetadataForm from './MetadataForm';


function AddMetadataForm({ appName, entityType, attributeTypes }: { appName: string; entityType: string, attributeTypes: string[] }) {
  
  const [entity, setEntity] = useState<Metadata>({
    entityName: "",
    attributes: [],
    // templates: [],
    // search: [],
    // transactions: []
  });
  
  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Create {entityType}
      </Typography>
      <MetadataForm appName={appName} entityType={entityType} attributeTypes={attributeTypes} setEntity={setEntity} entity={entity} mode="add" />
    </Paper>
  );
}
export default AddMetadataForm;