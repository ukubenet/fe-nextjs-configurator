'use client'

import { Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { deleteEntity } from '@/lib/api/entityActions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useNotification } from '@/contexts/NotificationContext';

interface EntityActionsProps {
  entityId: string;
  appName: string;
  catalog: string;
}

export function EntityActions({ entityId, appName, catalog }: EntityActionsProps) {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const { showNotification } = useNotification();

  const handleDelete = async () => {
    try {
      await deleteEntity(appName, catalog, entityId);
      showNotification(`${catalog} deleted successfully`, 'success');
      router.refresh();
    } catch (error) {
      showNotification(`Failed to delete ${catalog}`, 'error');
      console.error(error);
    }
    setOpenDialog(false);
  };

  return (
    <>
      <Stack direction="row" spacing={1}>
        <Button variant="contained" color="primary">
          Edit
        </Button>
        <Button 
          variant="contained" 
          color="error"
          onClick={() => setOpenDialog(true)}
        >
          Delete
        </Button>
      </Stack>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          {`Are you sure you want to delete this ${catalog}?`}
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
