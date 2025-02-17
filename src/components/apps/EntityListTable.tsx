import { 
  Typography, 
  Box, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material'
import EntityActions from './EntityActions';

export function EntityListTable({ appName, entityType, mode, list }: { appName: string; entityType: string; mode: string; list: string[] }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {entityType}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((entityName) => (
              <TableRow key={entityName}>
                <TableCell>{entityName}</TableCell>
                <TableCell>
                <EntityActions appName={appName} entityType={entityType} entityName={entityName} mode={mode} userRole={'admin'} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}