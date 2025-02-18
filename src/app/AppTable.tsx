"use client"; // Enables client-side interactions

import { SetStateAction, useState } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Button, IconButton, Stack, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from '@mui/icons-material/Settings';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Link from "next/link";
import { toast } from 'react-toastify'
import { API_CONFIG, fetchApi } from "@/config/api";


export interface AppRow {
  id: string;
}

export default function ClientTable({ initialRows }: { initialRows: AppRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState("");
  const [newRow, setNewRow] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  async function getAppData(): Promise<AppRow[]> {
    setIsLoading(true);
    const response = await fetchApi(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.app}`
    );
    let dataRows = await response?.json();
    if (!Array.isArray(dataRows)) {
      toast.error("dataRows must be an array of objects.");
    }
    
    dataRows = dataRows.map((row: string) => {
      const newRow = {id: row};
      return newRow;
    });
    setIsLoading(false);
    return dataRows;
  }

  const handleEdit = (row: { id: SetStateAction<string>; }) => {
    setSelectedRow(row.id);
    setNewRow(row.id);
    setEditOpen(true);
  };

 // Open add modal
  const handleAddRow = () => {
    setNewRow(""); 
    setAddOpen(true);
  };

  // Close modals
  const handleClose = () => {
    setEditOpen(false);
    setAddOpen(false);
    setSelectedRow("");
    setNewRow("");
  };

  const handleSave = async () => {
    if (newRow.length < 3 || newRow.length > 50) {
      toast.error("App name must be between 3 and 50 characters");
      return;
    }
    
    // Make an API call to save the edited data to the database
    await fetchApi(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.app}${selectedRow}`, 
      {
        method: 'PUT',
        body: JSON.stringify({ name: newRow }),
      }
    );

    // Update UI state
    setRows(rows.map((row) => (row.id === selectedRow ? {id: newRow} : row)));
    handleClose();
  };

  const handleDelete = async (id: string) => {
    await fetchApi(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.app}${id}`, {
           method: 'DELETE',
         });
    setRows(rows.filter((row) => row.id !== id));
  };


  const handleCopy = async (id: string) => {
      await fetchApi(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.duplicate}${id}`);
      setRows(await getAppData());
  };

  const handleAddSave = async (e: any) => {
    if (newRow.length < 3 || newRow.length > 50) {
      toast.error("App name must be between 3 and 50 characters");
      return;
    }

    await fetchApi(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.app}`, 
      {
        method: 'PUT',
        body: JSON.stringify({ name: newRow }),
      }
    );
  
    setRows(await getAppData());

    handleClose();
  };


  const handleNewRowChange = (e: { target: { value: any; }; }) => {
    setNewRow( e.target.value || "");
  };




  const columns: GridColDef<AppRow>[] = [
    { field: "id", headerName: "ID", width: 400, type: 'string' },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      sortable: false,
      headerAlign: "center",
      align: "left",

      type: 'actions',
      renderCell: (params: GridRenderCellParams<AppRow>) => (
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleCopy(params.row.id)}>
            <ContentCopyIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
          <Link color="gray" href={`/apps/${params.row.id}/config`}>
            <IconButton>
              <SettingsIcon />
            </IconButton>
          </Link>
          <Link href={`/apps/${params.row.id}/run`}>
            <IconButton>
              <PlayArrowIcon /> 
            </IconButton>
          </Link>
        </Stack>
      ),
    },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleAddRow}
        style={{ marginBottom: "10px" }}
      >
        Add App
      </Button>


      <DataGrid rows={rows} columns={columns} pageSize={5} loading={isLoading} />

      {/* Edit Modal */}
      <Dialog open={editOpen} onClose={handleClose}>
        <DialogTitle>Edit App Name</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Name" name="name" fullWidth value={newRow} onChange={handleNewRowChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

        {/* Add New Row Modal */}
        <Dialog open={addOpen} onClose={handleClose}>
        <DialogTitle>Add New Row</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Name" name="name" fullWidth value={newRow} onChange={handleNewRowChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleAddSave} color="primary">Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}