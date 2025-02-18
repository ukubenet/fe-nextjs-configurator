import AppTable from "@/app/AppTable";
import { API_CONFIG, fetchApi } from "@/config/api";
import { toast } from "react-toastify";

// Fetch data on the server
async function getData() {
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
