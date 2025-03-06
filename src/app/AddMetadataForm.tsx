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
  IconButton,
  Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { API_ENDPOINTS, fetchApi } from '@/config/api';

function AddMetadataForm({ appName, entityType }: { appName: string; entityType: string }) {
  
  const [entity, setEntity] = useState({entityName: "", attributes: []} as unknown as Metadata);
  
  const handleEntityNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEntity(prev => ({
      ...prev,
      entityName: value
    }));
  };

  const handleAttributeNameChange = (index: number, newName: string) => {
    setEntity(prev => {
      const updatedAttributes = [...prev.attributes];
      const [oldName, attributeValue] = updatedAttributes[index];
      updatedAttributes[index] = [newName, attributeValue];
      
      return {
        ...prev,
        attributes: updatedAttributes
      };
    });
  };

  const handleAttributeTypeChange = (index: number, value: string) => { 
    setEntity(prev => ({
      ...prev,
      attributes: prev.attributes.map((attr, idx) => 
        idx === index ? [attr[0], { ...attr[1], type: value }] : attr
      )
    }));
  };

  const addAttribute = () => {
    setEntity(prev => {
      const updatedAttributes = [...prev.attributes];
      updatedAttributes.push(["", { type: "string" }]);
      
      return {
        ...prev,
        attributes: updatedAttributes
      };
    });
  };

  const handleDeleteAttribute = (index: number) => {
    setEntity(prev => {
      const updatedAttributes = [...prev.attributes];
      updatedAttributes.splice(index, 1);

      return {
        ...prev,
        attributes: updatedAttributes
      };
    });
  };

  function handleSwapAttribute(index1: number, index2: number): void {
    setEntity(prev => {
      const updatedAttributes = [...prev.attributes];
      const row1 = updatedAttributes[index1];
      updatedAttributes[index1] = updatedAttributes[index2];
      updatedAttributes[index2] = row1;

      return {
        ...prev,
        attributes: updatedAttributes
      };
    });
    
  }

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Edit {entityType}
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

        {entity.attributes.map((attribute, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <TextField
              label="Attribute Name"
              value={attribute[0]}
              onChange={(e) => handleAttributeNameChange(index, e.target.value)}
              size="small"
            />
            <TextField
              label="Type"
              value={attribute[1].type}
              onChange={(e) => handleAttributeTypeChange(index, e.target.value)}
              size="small"
            />
          <Stack direction="column" spacing={0.5} alignItems="center">
            <IconButton size="small" disabled={index === 0}>
              <KeyboardArrowUpIcon fontSize="small" onClick={() => handleSwapAttribute(index - 1, index)} />
            </IconButton>
            <IconButton size="small" disabled={index === entity.attributes.length - 1}>
              <KeyboardArrowDownIcon fontSize="small" onClick={() => handleSwapAttribute(index, index + 1)} />
            </IconButton>
          </Stack>
          <IconButton >
            <DeleteIcon onClick={() => handleDeleteAttribute(index)} />
          </IconButton>
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
            onClick={addAttribute}
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
          Save
        </Button>
      </Box>
    </Paper>
  );
}


export default AddMetadataForm;