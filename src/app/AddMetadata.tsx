"use client"
import React, { useState, useEffect, useCallback } from 'react';
import MetadataAttributes from './MetadataAttributes';
import { EditMode, Metadata } from '@/types/app';
import { 
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function AddMetadataForm({ appName, entityType }: { appName: string; entityType: string }) {

  

return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Create New {entityType}
      </Typography>
      <Box 
        component="form" 
        // onSubmit={handleSubmit} 
        sx={{ mt: 2 }}
      >
        <TextField
          fullWidth
          label="Entity Name"
          value={entity.entityName}
          InputLabelProps={{ shrink: true }}
          // onChange={handleEntityNameChange}
          margin="normal"
        />
        
        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
          Attributes
        </Typography>

        
        {Object.entries(entity.attributes).map(([attributeName, attributeType]) => (
          <Box key={attributeName} sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Attribute Name"
              // value={attributeName}
              // onChange={(e) => handleAttributeNameChange(attributeName, e.target.value)}
              size="small"
            />
            <TextField
              label="Type"
              value={attributeType.type}
              // onChange={(e) => handleAttributeChange(attributeName, 'type', e.target.value)}
              size="small"
            />
          </Box>
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'left', mt: 2 }}>
          <IconButton 
            color="primary"
             
            sx={{ 
              border: '1px dashed',
              borderRadius: 1,
              p: 1
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>

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

export default EditMetadataForm;