import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, IconButton, Stack, TextField, Typography } from '@mui/material';
import React from 'react';
import MetadataAttributeType from './MetadataAttributeType';
import MetadataAttributeReference from "./MetadataAttributeReference";
import MetadataAttributeTable from "./MetadataAttributeTable";

function MetadataAttribute({
  setEntity,
  entity,
  attributeTypes,
  attribute,
  index
}: {
  setEntity: React.Dispatch<React.SetStateAction<any>>;
  entity: any;
  attributeTypes: string[];
  attribute: [string, any];
  index: number;
}) {
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
    <Box key={index} sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 1.5, 
        mb: 2, 
        p: 2, 
        border: '1px solid #ccc', 
        borderRadius: 2 
    }}>
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            label="Attribute Name"
            value={attribute[0]}
            onChange={(e) => handleAttributeNameChange(index, e.target.value)}
            size="small"
          />
          <MetadataAttributeType
            index={index}
            attribute={attribute}
            attributeTypes={attributeTypes}
            setEntity={setEntity}
          />

          <Stack direction="column" spacing={0.5} alignItems="center">
            <IconButton size="small" disabled={index === 0} onClick={() => handleSwapAttribute(index - 1, index)}>
              <KeyboardArrowUpIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" disabled={index === entity.attributes.length - 1} onClick={() => handleSwapAttribute(index, index + 1)}>
              <KeyboardArrowDownIcon fontSize="small" />
            </IconButton>
          </Stack>
          <IconButton onClick={() => handleDeleteAttribute(index)}>
            <DeleteIcon />
          </IconButton>
        </Box>
        
        {/* Reference Specs (Second Row) */}
        {attribute[1].type === "reference" && (
            <MetadataAttributeReference
              attribute={attribute}
              index={index}
              setEntity={setEntity}
            />
        )}

        {/* Table Specs (Second Row) */}
        {attribute[1].type === "table" && (
            <MetadataAttributeTable />
        )}
        
    </Box>
  );
}

export default MetadataAttribute;