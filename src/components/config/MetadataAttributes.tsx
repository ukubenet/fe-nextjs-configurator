import AddIcon from '@mui/icons-material/Add';
import { Box, IconButton } from '@mui/material';
import React from 'react';
import MetadataAttribute from './MetadataAttribute';

function MetadataAttributes(
  { setEntity, entity, attributeTypes }: 
  { attributes: [string, any][], setEntity: React.Dispatch<React.SetStateAction<any>>, entity: any, attributeTypes: string[] }
) {
  
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

  return (
    <>
      {entity.attributes.map((attribute, index) => (
        <MetadataAttribute
          key={index}
          attribute={attribute}
          index={index}
          setEntity={setEntity}
          entity={entity}
          attributeTypes={attributeTypes}
        />
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
    </>
  );
}

export default MetadataAttributes;
