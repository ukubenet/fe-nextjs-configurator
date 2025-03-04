"use client"
import React, { useState, useEffect, useCallback } from 'react';
import MetadataAttributes from './MetadataAttributes';
import { EditMode, Metadata } from '@/types/app';
import { 
  Box,
  TextField,
  Button,
  Paper,
  Typography
} from '@mui/material';

function MetadataForm({ entity, entityType, mode }: { entity: Metadata; entityType: string; mode:  EditMode}) {
  console.log("MetadataForm - entity:", entity);
  const [formData, setFormData] = useState(entity);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitButton = document.getElementById('submitButton') as HTMLButtonElement;
    submitButton.disabled = true;
    try {
      const response = await fetch(
        `/v1/metadata/api/${appName}/${entityType}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        },
      );
      if (response.status === 201) {
        window.location.href = `/v1/app/config/${appName}`;
      } else {
        console.error(`Status: ${response.status}`);
        submitButton.disabled = false;
      }
    } catch (error) {
      console.error(error);
      submitButton.disabled = false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFormSubmit(e);
  };

  const handleAttributeChange = (attributeName: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [attributeName]: {
          ...prev.attributes[attributeName],
          [field]: value,
        },
      },
    }));
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        {mode === 'edit' ? 'Edit' : 'Create New'} {entityType}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Entity Name"
          value={formData?.entityName}
          InputLabelProps={{ shrink: true }}
          onChange={handleChange}
          margin="normal"
        />
        
        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
          Attributes
        </Typography>
        
        {Object.entries(entity.attributes).map(([attributeName, attributeType]) => (
          <Box key={attributeName} sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Attribute Name"
              value={attributeName}
              onChange={(e) => handleAttributeChange(attributeName, 'name', e.target.value)}
              size="small"
            />
            <TextField
              label="Type"
              value={attributeType.type}
              onChange={(e) => handleAttributeChange(attributeName, 'type', e.target.value)}
              size="small"
            />
          </Box>
        ))}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          id="submitButton"
        >
          {mode === 'edit' ? 'Save' : 'Create'}
        </Button>
      </Box>
    </Paper>
  );
}

export default MetadataForm;