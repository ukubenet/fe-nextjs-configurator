import { API_ENDPOINTS, fetchApi } from '@/config/api';
import { Metadata } from '@/types/app';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useAppContext } from './AppContext';
import { useEffect, useState } from 'react';

function MetadataAttributeReference(
    { attribute, index, setEntity }: 
    { attribute: [string, any], index: number, setEntity: React.Dispatch<React.SetStateAction<Metadata>> }
) {

 const { appName } = useAppContext();
 const [referenceType, setReferenceType] = useState(attribute[1].referenceType || "catalog");
 const [referenceEntity, setReferenceEntity] = useState(attribute[1].reference || "");
 const [selectedAttributes, setSelectedAttributes] = useState<string[]>(attribute[1].view || []);

  // Sync state when attribute changes
  useEffect(() => {
    setReferenceType(attribute[1].referenceType || "catalog");
    setReferenceEntity(attribute[1].reference || "");
    setSelectedAttributes(attribute[1].view || []);
 }, [attribute]);

  // Fetch list of reference entities based on referenceType
 const { data: referenceEntities = [], isLoading: isLoadingEntities, isError: isErrorFetchEntities } = useQuery({
    queryKey: ['referenceEntities', appName, referenceType],
    queryFn: async () => {
      const response = await fetchApi(API_ENDPOINTS.METADATA_LIST(appName, referenceType));
      const data = await response.json();
      console.log(data);
      return data;
    },
    enabled: !!referenceType, // Ensure query runs only if referenceType exists
  });

  // Fetch list of attributes for the selected entity
  const { data: entityAttributes = [], isLoading: isLoadingAttributes, isError: isErrorFetchAttributes } = useQuery({
    queryKey: ['entityAttributes', appName, referenceType, referenceEntity],
    queryFn: async () => {
      const response = await fetchApi(API_ENDPOINTS.METADATA_ENTITY_GET(appName, referenceType, referenceEntity));
      const result = await response.json() as unknown as Metadata;        
      return Object.keys(result.attributes);
    },
    enabled: !!referenceEntity && !!referenceType, // Ensure query runs only if referenceEntity and referenceType exist
  });

  // Update entity reference type in state when selection changes
  const handleReferenceEntityTypeChange = (e: SelectChangeEvent) => {
    const newValue = e.target.value;
    setReferenceType(newValue);
    setReferenceEntity(""); // Reset reference entity when reference type changes
    setSelectedAttributes([]); // Reset selected attributes when reference type changes
    setEntity(prev => {
      const updatedAttributes = [...prev.attributes];
      updatedAttributes[index][1].referenceType = newValue;
      updatedAttributes[index][1].reference = undefined;
      updatedAttributes[index][1].view = [];
      console.log(updatedAttributes);
      return { ...prev, attributes: updatedAttributes };
    });
  };

  // Update entity reference in state when selection changes
  const handleReferenceEntityChange = (e: SelectChangeEvent) => {
    const newValue = e.target.value;
    setReferenceEntity(newValue);
    setSelectedAttributes([]);
    setEntity(prev => {
      const updatedAttributes = [...prev.attributes];
      updatedAttributes[index][1].referenceType = referenceType;
      updatedAttributes[index][1].reference = newValue;
      updatedAttributes[index][1].view = [];
      console.log(updatedAttributes);
      return { ...prev, attributes: updatedAttributes };
    });
  };

  // Update entity reference attributes in state when selection changes
  const handleReferenceAttributesChange = (e: SelectChangeEvent<string[]>) => {
    const newValue = e.target.value as string[];
    setSelectedAttributes(newValue);
    setEntity (prev => {
      const updatedAttributes = [...prev.attributes];
      updatedAttributes[index][1].view = newValue;
      console.log(updatedAttributes);
      return { ...prev, attributes: updatedAttributes };
    });
};

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="body2" sx={{ color: 'gray' }}>Reference</Typography>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id={`${index}-reference-entity-type-label`} shrink>Entity Type</InputLabel>
            <Select
                labelId={`${index}-reference-entity-type-label`}
                value={referenceType}
                onChange={handleReferenceEntityTypeChange}
                label="Entity Type"
            >
                <MenuItem key="catalog" value="catalog">Catalog</MenuItem>
                <MenuItem key="event" value="event">Event</MenuItem>
            </Select>
        </FormControl>

        {/* Entity List Dropdown */}
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small" disabled={isLoadingEntities || isErrorFetchEntities}>
            <InputLabel id={`${index}-reference-entity-list-label`} shrink>Entity List</InputLabel>
            <Select
                labelId={`${index}-reference-entity-list-label`}
                value={referenceEntity}
                onChange={handleReferenceEntityChange}
                label="Entity List"
            >
                {referenceEntities.length > 0 ? (
                    referenceEntities.map((entity: string) => (
                        <MenuItem key={entity} value={entity}>
                            {entity}
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem disabled>No entities available</MenuItem>
                )}
            </Select>
        </FormControl>

        {/* MultiSelect for Entity Attributes */}
        {referenceEntity && (
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small" disabled={isLoadingAttributes || isErrorFetchAttributes}>
                <InputLabel id={`${index}-reference-entity-attributes-label`} shrink={selectedAttributes.length > 0}>Reference Attributes</InputLabel>
                <Select
                    labelId={`${index}-reference-entity-attributes-label`}
                    multiple
                    value={selectedAttributes}
                    onChange={handleReferenceAttributesChange}
                    renderValue={(selected) => selected.join(', ')}
                    label="Reference Attributes"
                >
                    {entityAttributes.length > 0 ? (
                        entityAttributes.map((attr: string) => (
                            <MenuItem key={attr} value={attr}>
                                {attr}
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem disabled>No attributes available</MenuItem>
                    )}
                </Select>
            </FormControl>
        )}
    </Box>
);
}export default MetadataAttributeReference;