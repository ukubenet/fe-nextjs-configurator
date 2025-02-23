import AppList from "@/app/AppList";
import { API_ENDPOINTS, getSingleColumn } from "@/config/api";
import { toast } from "react-toastify";

export default async function Home() {
  const rows = await getSingleColumn(API_ENDPOINTS.APP); 
  return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">App List</h1>
          <AppList initialRows={rows} />
        </div>
       </main>
       <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      
       </footer>
     </div>
  );
}
