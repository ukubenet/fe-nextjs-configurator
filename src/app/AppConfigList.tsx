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
import { API_ENDPOINTS, fetchApi, getSingleColumn } from "@/config/api";


export interface AppRow {
  id: string;
}

export default function AppConfigList({ appName, entityType, initialRows }: { appName: string, entityType: string, initialRows: AppRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const [isLoading, setIsLoading] = useState(false);


  async function getAppData(): Promise<AppRow[]> {
    setIsLoading(true);
    const dataRows = await getSingleColumn(API_ENDPOINTS.METADATA_LIST(appName, entityType));
    setIsLoading(false);
    return dataRows;
  }

  

  const handleDelete = async (id: string) => {
    await fetchApi(API_ENDPOINTS.METADATA(appName, entityType, id), {
           method: 'DELETE',
         });
    setRows(rows.filter((row) => row.id !== id));
  };


  const handleCopy = async (id: string) => {
      await fetchApi(API_ENDPOINTS.METADATA_COPY(appName, entityType, id));
      setRows(await getAppData());
  };

  const columns: GridColDef<AppRow>[] = [
    { field: "id", headerName: "Name", minWidth: 600, type: 'string' },
    {
      field: "actions",
      headerName: "Actions",
      width: 230,
      sortable: false,
      headerAlign: "center",
      align: "center",

      type: 'actions',
      renderCell: (params: GridRenderCellParams<AppRow>) => (
        <Stack direction="row" spacing={1}>
           <Link color="gray" href={`/apps/${appName}/config/edit/${entityType}/${params.row.id}`}>
            <IconButton >
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton >
            <ContentCopyIcon onClick={() => handleCopy(params.row.id)} />
          </IconButton>
          <IconButton >
            <DeleteIcon onClick={() => handleDelete(params.row.id)} />
          </IconButton>
          {/* <Link color="gray" href={`/apps/${params.row.id}/config`}>
            <IconButton>
              <SettingsIcon />
            </IconButton>
          </Link>
          <Link href={`/apps/${params.row.id}/run`}>
            <IconButton>
              <PlayArrowIcon /> 
            </IconButton>
          </Link> */}
        </Stack>
      ),
    },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        style={{ marginBottom: "10px" }}
      >
        Add Entity
      </Button>

      <DataGrid rows={rows} columns={columns} pageSize={5} loading={isLoading}  />
    </div>
  );
}