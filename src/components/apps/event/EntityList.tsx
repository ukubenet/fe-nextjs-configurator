'use client'

import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { EventItem } from '@/types/app'
import { IconButton, Button } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import Link from 'next/link'

interface EntityListProps {
  appName: string
  event: string
  eventEntities: EventItem[]
}

interface ReferenceValue {
  reference: string
  type: string
  view: Record<string, string>
}

export function EntityList({ appName, event, eventEntities }: EntityListProps) {
  const handleAdd = () => {
    console.log('Add new event clicked')
  }
  
  const handleDelete = (id: string) => {
    // Add delete logic here
    console.log('Delete clicked for id:', id)
  }

  const generateColumns = (entities: EventItem[]): GridColDef[] => {
    if (entities.length === 0) return [];

    const columns: GridColDef[] = [
      { field: 'id', headerName: 'ID', width: 90 },
      { field: 'EventTime', headerName: 'Event Time', width: 200 }
    ];

    const firstEntity = entities[0];
    Object.entries(firstEntity.attributes).forEach(([key, value]) => {
      if (typeof value === 'object' && (value as ReferenceValue)?.type === 'reference') {
        Object.keys((value as ReferenceValue).view).forEach(viewKey => {
          columns.push({
            field: `${key}_${viewKey}`,
            headerName: `${key} ${viewKey}`,
            width: 150
          });
        });
      } else if (key !== 'EventTime') {
        columns.push({
          field: key,
          headerName: key,
          width: 150
        });
      }
    });

    columns.push({
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <>
          <Link href={`/apps/${appName}/run/event/${event}/edit/${params.row.id}`} style={{ textDecoration: 'none' }}>
            <IconButton>
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    });

    return columns;
  };

  const generateRows = (entities: EventItem[]) => {
    return entities.map(entity => {
      const row: any = {
        id: entity.identifier,
        EventTime: entity.attributes.EventTime
      };

      Object.entries(entity.attributes).forEach(([key, value]) => {
        if (typeof value === 'object' && (value as ReferenceValue)?.type === 'reference') {
          Object.entries((value as ReferenceValue).view).forEach(([viewKey, viewValue]) => {
            row[`${key}_${viewKey}`] = viewValue;
          });
        } else if (key !== 'EventTime') {
          row[key] = value;
        }
      });

      return row;
    });
  };

  const columns = generateColumns(eventEntities);
  const rows = generateRows(eventEntities);

  return (
    <>
      <Link href={`/apps/${appName}/run/event/${event}/new`} style={{ textDecoration: 'none' }}>
        <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{ mb: 2 }}
          >
            Add Event
        </Button>
      </Link>

      <div style={{ height: 400, width: '100%', marginTop: '20px' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
        />
      </div>
    </>
  );
}
