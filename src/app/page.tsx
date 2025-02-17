import { DataGrid } from "@mui/x-data-grid";
import { Button, IconButton, Stack, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import AppTable from "@/app/AppTable";

// Fetch data on the server
async function getData() {
  const response = await fetch(
    'http://localhost:4000/v1/api/app',
    {
      headers: { "Content-Type": "application/json", "Accept": "application/json", cache: "no-store" },
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

export default async function Home() {
  const rows = await getData(); 
  return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">App List</h1>
          <AppTable initialRows={rows} />
           </div>
       </main>
       <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      
       </footer>
     </div>
  );
}
