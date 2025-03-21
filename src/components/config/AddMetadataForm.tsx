"use client"
import { Metadata } from '@/types/app';


import {
  Box,
  Button,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import MetadataAttributes from './MetadataAttributes';

function AddMetadataForm({ appName, entityType, attributeTypes }: { appName: string; entityType: string, attributeTypes: string[] }) {
  
  const [entity, setEntity] = useState<Metadata>({
    entityName: "",
    attributes: [],
    templates: [],
    search: [],
    transactions: []
  });
  
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
        Create {entityType}
      </Typography>
      <Box 
        component="form" 
        sx={{ mt: 2 }}
      >
        <TextField
          fullWidth
          label="Entity Name"
          value={entity.entityName}
          onChange={handleEntityNameChange}
          margin="normal"
        />
        
        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
          Attributes
        </Typography>


        <MetadataAttributes 
          attributes={entity.attributes}
          setEntity={setEntity}
          entity={entity}
          attributeTypes={attributeTypes}
        />
        

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
    </Paper>
  );
}
export default AddMetadataForm;