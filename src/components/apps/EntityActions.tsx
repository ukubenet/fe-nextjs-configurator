'use client'

import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function EntityActions({
  appName,
  entityType,
  entityName,
  mode,
  userRole,
}: {
  appName: string
  entityType: string
  entityName: string
  mode: string
  userRole?: 'admin' | 'editor' | 'viewer'
}) {
  const [openDialog, setOpenDialog] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      // Simulated API call (replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success(`"${entityName}" has been deleted successfully.`)
      setOpenDialog(false)
    } catch (error) {
      toast.error(`Failed to delete "${entityName}". Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      {mode === 'run' ? (
        <Link href={`/apps/${appName}/${mode}/${entityType}/${entityName}`} passHref legacyBehavior>
          <Button variant="contained">View</Button>
        </Link>
      ) : (
        <>
          <Link href={`/apps/${appName}/edit/${entityType}/${entityName}`} passHref legacyBehavior>
            <Button variant="contained" color="primary" disabled={userRole === 'viewer'}>
              Edit
            </Button>
          </Link>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setOpenDialog(true)}
            disabled={userRole !== 'admin'}
          >
            Delete
          </Button>
          <Button variant="contained" color="info" onClick={() => toast.info(`"${entityName}" copied successfully.`)}>
            Copy
          </Button>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete "{entityName}"?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary" autoFocus disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default EntityActions