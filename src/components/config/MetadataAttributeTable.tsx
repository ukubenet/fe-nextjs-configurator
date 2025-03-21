import { Box, Typography } from '@mui/material';

function MetadataAttributeTable() {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
    <Typography variant="body2" sx={{ color: 'gray' }}>Table</Typography>
    <Box sx={{ backgroundColor: '#f5f5f5', p: 1, borderRadius: 1 }}>
        Table
    </Box>
    </Box>
  );
}
export default MetadataAttributeTable;
