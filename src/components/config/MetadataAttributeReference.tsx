import { Metadata } from '@/types/app';
import { Box, TextField, Typography } from '@mui/material';

function MetadataAttributeReference(
    { attribute, index, setEntity }: 
    { attribute: [string, any], index: number, setEntity: React.Dispatch<React.SetStateAction<Metadata>> }
) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="body2" sx={{ color: 'gray' }}>Reference</Typography>
        <TextField
        label="Reference"
        value={attribute[1].reference}
        onChange={(e) => {
            setEntity(prev => {
            const updatedAttributes = [...prev.attributes];
            updatedAttributes[index][1].reference = e.target.value;
            return {
                ...prev,
                attributes: updatedAttributes
            };
            });
        }}
        size="small"
        />
    </Box>
);
}
export default MetadataAttributeReference;