import AddIcon from '@mui/icons-material/Add';
import { Box, IconButton, Typography } from '@mui/material';
import React from 'react';
import MetadataAttribute from './MetadataAttribute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

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
    <QueryClientProvider client={queryClient}>
        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
          Attributes
        </Typography>

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
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default MetadataAttributes;
