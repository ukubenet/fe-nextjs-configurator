"use client"; // Enables client-side interactions

import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, IconButton, Stack, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from '@mui/icons-material/Settings';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Link from "next/link";


export default function ClientTable({ initialRows }) {
  const [rows, setRows] = useState(initialRows);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState("");
  const [newRow, setNewRow] = useState("");


  async function getAppData() {
    const response = await fetch(
      'http://localhost:4000/v1/api/app',
      {
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
      }
    );
    const dataRows = await response.json();
    if (!Array.isArray(dataRows)) {
      throw new Error("dataRows must be an array of objects.");
    }
  
    return dataRows.map(row => {
      const newRow = { ...row };
      newRow["id"] = row;
      return newRow;
    });
    return dataRows;
  }

  const handleEdit = (row) => {
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
  };;

  const handleSave = async () => {
    // Make an API call to save the edited data to the database
    await fetch(
      `http://localhost:4000/v1/api/app/${selectedRow}`, 
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newRow }),
      }
    );

    // Update UI state
    setRows(rows.map((row) => (row.id === selectedRow ? {id: newRow} : row)));
    handleClose();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:4000/v1/api/app/${id}`, {
           method: 'DELETE',
         });
    setRows(rows.filter((row) => row.id !== id));
  };


  const handleCopy = async (id) => {
      await fetch(`http://localhost:4000/v1/api/app/duplicate/${id}`);
      setRows(await getAppData());
  };

  const handleAddSave = async (e) => {
    if (!newRow.trim()) return;

    const response = await fetch(
      'http://localhost:4000/v1/api/app/', 
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newRow }),
      }
    );
  
    setRows(await getAppData());

    handleClose();
  };


  const handleNewRowChange = (e) => {
    setNewRow( e.target.value || "");
  };


  const columns = [
    { field: "id", headerName: "ID", width: 400 },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      sortable: false,
      headerAlign: "center",
      align: "left",
      renderCell: (params) => (
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

      <DataGrid rows={rows} columns={columns} pageSize={5} />

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