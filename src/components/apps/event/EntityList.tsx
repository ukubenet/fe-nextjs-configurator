'use client'

import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { EventItem } from '@/types/app'
import { IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import PublishIcon from '@mui/icons-material/Publish'
import UndoIcon from '@mui/icons-material/Undo'
import VisibilityIcon from '@mui/icons-material/Visibility'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { useState } from 'react'
import { useNotification } from '@/contexts/NotificationContext';
import { deleteEntity } from '@/lib/api/entityActions';

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
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { showNotification } = useNotification();
  const router = useRouter();

  const openDeleteDialog = (id: string) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteEntity(appName, 'event', event, deleteId);
        showNotification(`${event} deleted successfully`, 'success');
        router.refresh();
      } catch (error) {
        showNotification(`Failed to delete ${event}`, 'error');
        console.error(error);
      }
    }
    setOpenDialog(false);
    setDeleteId(null);
  }

  const handleClose = async (id: string) => {
    try {
      // Implement the API call to close the entity
      // await closeEntity(appName, 'event', event, id);
      showNotification(`${event} closed successfully`, 'success');
      router.refresh();
    } catch (error) {
      showNotification(`Failed to close ${event}`, 'error');
      console.error(error);
    }
  }

  const handleReopen = async (id: string) => {
    try {
      // Implement the API call to reopen the entity
      // await reopenEntity(appName, 'event', event, id);
      showNotification(`${event} reopened successfully`, 'success');
      router.refresh();
    } catch (error) {
      showNotification(`Failed to reopen ${event}`, 'error');
      console.error(error);
    }
  }

  const generateColumns = (entities: EventItem[]): GridColDef[] => {
    if (!entities || entities.length === 0) return [];

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
      width: 200,
      renderCell: (params) => {
        const isClosed = params.row.isClosed;
        return (
          <>
            <Link href={`/apps/${appName}/run/event/${event}/view/${params.row.id}`} style={{ textDecoration: 'none' }}>
              <Tooltip title="View">
                <IconButton>
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
            </Link>
            
            {isClosed ? (
              <Tooltip title="Cannot edit closed events">
                <span>
                  <IconButton disabled>
                    <EditIcon color="disabled" />
                  </IconButton>
                </span>
              </Tooltip>
            ) : (
              <Link href={`/apps/${appName}/run/event/${event}/edit/${params.row.id}`} style={{ textDecoration: 'none' }}>
                <Tooltip title="Edit">
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </Link>
            )}
            
            <Tooltip title={isClosed ? "Cannot delete closed events" : "Delete"}>
              <span>
                <IconButton 
                  onClick={() => !isClosed && openDeleteDialog(params.row.id)} 
                  disabled={isClosed}
                >
                  <DeleteIcon color={isClosed ? "disabled" : "inherit"} />
                </IconButton>
              </span>
            </Tooltip>
            
            {!isClosed && (
              <Tooltip title="Close">
                <IconButton onClick={() => handleClose(params.row.id)}>
                  <PublishIcon />
                </IconButton>
              </Tooltip>
            )}
            
            {isClosed && (
              <Tooltip title="Reopen">
                <IconButton onClick={() => handleReopen(params.row.id)}>
                  <UndoIcon />
                </IconButton>
              </Tooltip>
            )}
          </>
        );
      },
    });

    return columns;
  };

  const generateRows = (entities: EventItem[]) => {
    if (!entities || entities.length === 0) return [];
    
    return entities.map(entity => {
      const row: any = {
        id: entity.identifier,
        EventTime: entity.attributes.EventTime,
        isClosed: entity.isClosed
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          {`Are you sure you want to delete this ${event} event?`}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
