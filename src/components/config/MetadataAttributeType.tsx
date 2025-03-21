import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function MetadataAttributeType(
  { index, attribute, attributeTypes, setEntity }: {
    index: number;
    attribute: [string, { type: string }];
    attributeTypes: string[];
    setEntity: React.Dispatch<React.SetStateAction<any>>;
  }
) {

    const handleAttributeTypeChange = (index: number, value: string) => { 
        setEntity((prev: { attributes: [string, { type: string }][] }) => ({
          ...prev,
          attributes: prev.attributes.map((attr, idx) => 
            idx === index ? [attr[0], { ...attr[1], type: value }] : attr
          )
        }));      
    };

return (    
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id={`${index}-type-label`} shrink>Type</InputLabel>
        <Select
        labelId={`${index}-type-label`}
        value={attribute[1].type}
        onChange={(e) => handleAttributeTypeChange(index, e.target.value as string)}
        label="Type" // Added label prop
        >
        {attributeTypes.map((type) => (
            <MenuItem key={type} value={type}>{type}</MenuItem>
        ))}
        </Select>
    </FormControl>
  );
}

export default MetadataAttributeType;