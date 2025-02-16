import { getAllCatalogEntities } from '@/lib/api/catalog';
import { EntityActions } from './EntityActions';
import { CatalogItem } from '@/types/app';
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
  Box
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Link from 'next/link'

export default async function CatalogPage({
  params,
}: { 
  params: Promise<{ catalog: string, appName: string }> 
}) {
  const { catalog, appName } = await params;
  const catalogEntities: CatalogItem[] = await getAllCatalogEntities(appName, catalog);
  const attributeKeys = Object.keys(catalogEntities[0]?.attributes || {});

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
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              {attributeKeys.map((key) => (
                <TableCell key={key} sx={{ 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }}>{key}</TableCell>
              ))}
              <TableCell sx={{ 
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1rem'
          }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {catalogEntities.map((item) => (
              <TableRow key={item.identifier}>
                {attributeKeys.map((key) => (
                  <TableCell key={key}>
                    {item.attributes[key]}
                  </TableCell>
                ))}
                <TableCell>
                  <EntityActions 
                    entityId={item.identifier}
                    appName={appName}
                    catalog={catalog}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Link href={`/apps/${appName}/run/catalog/${catalog}/new`} style={{ textDecoration: 'none' }}>
          <Button variant="contained" color="primary">
            New
          </Button>
        </Link>
      </Box>
    </Container>
  )
}