import { getCatalogDetails } from '@/lib/api/catalog';
import { 
  Container, 
  Typography, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
  Box
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Link from 'next/link'

interface CatalogItem {
  entityName: string;
  entityType: number;
  identifier: string;
  attributes: Record<string, string>;
  transactions: null;
}

export default async function CatalogPage({ 
  params,
}: { 
  params: Promise<{ catalog: string, appName: string }> 
}) {
  const { catalog, appName } = await params;
  const catalogDetails = await getCatalogDetails(appName, catalog);
  const attributeKeys = Object.keys(catalogDetails[0]?.attributes || {});

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Link href={`/apps/${appName}/run`} style={{ textDecoration: 'none' }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          sx={{ mb: 4 }}
        >
          Back to App Run
        </Button>
      </Link>
      <Typography variant="h4" gutterBottom>
        Catalog: {catalog}
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {attributeKeys.map((key) => (
                <TableCell key={key}>{key}</TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {catalogDetails.map((item) => (
              <TableRow key={item.identifier}>
                {attributeKeys.map((key) => (
                  <TableCell key={key}>
                    {item.attributes[key]}
                  </TableCell>
                ))}
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button variant="contained" color="primary">
                      Edit
                    </Button>
                    <Button variant="contained" color="error">
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary">
          New
        </Button>
      </Box>
    </Container>
  )
}