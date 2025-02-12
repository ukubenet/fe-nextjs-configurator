'use client';

import { App } from "@/types/app";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from 'next/link'

export default function Home() {
  const [apps, setApps] = useState<string[]>([]);
  const [newApp, setNewApp] = useState("");
  const [editingApp, setEditingApp] = useState("");
  const [editedApp, setEditedApp] = useState("");

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    const response = await fetch(
      'http://localhost:4000/v1/api/app',
      {
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
      }
    );
    const data = await response.json();
    setApps(data);
  };

  const addApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApp.trim()) return;

    const response = await fetch(
      'http://localhost:4000/v1/api/app/', 
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newApp }),
      }
    );
  
    setApps([...apps, newApp]);
    setNewApp("");
  };

  const handleDelete = async (deletingApp: string) => {
    await fetch(`http://localhost:4000/v1/api/app/${deletingApp}`, {
      method: 'DELETE',
    });
    setApps(apps.filter(app => app !== deletingApp));
  };

  const handleDuplicate = async (duplicatedApp: string) => {
    await fetch(`http://localhost:4000/v1/api/app/duplicate/${duplicatedApp}`);
    await fetchApps();
  };

  function startEditing(app: string) {
    setEditingApp(app);
    setEditedApp(app);
  }

  function cancelEditing() {
    setEditingApp("");
    setEditedApp("");
  }

  const changeApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedApp.trim()) return;

    const response = await fetch(
      'http://localhost:4000/v1/api/app/' + editingApp, 
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editedApp }),
      }
    );
    
    setApps(apps.map(app => app === editingApp ? editedApp : app));
    setEditingApp("");
    setEditedApp("");
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">App List</h1>
        <form className="flex gap-2" onSubmit={addApp}>
          <input 
            type="text"
            placeholder="Add app..."
            className="flex-1 px-4 py-2 border rounded"
            value={newApp}
            onChange={(e) => setNewApp(e.target.value)}
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add
          </button>
        </form>
        <ul className="flex flex-col gap-2">
          {apps.map((app) => (
            <li key={app} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              {editingApp === app 
              ? (
                <form className="flex gap-2" onSubmit={ changeApp }>
                <input 
                  type="text"
                  placeholder="Add app..."
                  className="flex-1 px-4 py-2 border rounded"
                  value={editedApp}
                  onChange={(e) => setEditedApp(e.target.value)}
                />
                <div className="ml-auto">
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                  >
                    Change
                  </button>
                  <button 
                    onClick={() => cancelEditing()}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
              ) 
              : (
                <>
                  <div className="flex items-center gap-2">
                    {app}
                  </div>
                  <div className="ml-auto">
                    <button 
                      onClick={() => startEditing(app)}
                      className="text-green-500 hover:text-green-700 mr-2"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDuplicate(app)}
                      className="text-green-500 hover:text-green-700 mr-2"
                    >
                      Duplicate
                    </button>
                    <button 
                      onClick={() => handleDelete(app)}
                      className="text-red-500 hover:text-red-700 mr-2"
                    >
                      Delete
                    </button>
                    <Link href={`/apps/${app}/config`} className="text-green-500 hover:text-green-700 mr-2">
                        Config
                    </Link>
                    <Link href={`/apps/${app}/run`} className="text-green-500 hover:text-green-700">
                        Run Mode
                    </Link>
                  </div>
                </>
              )}
              
    
            </li>
          ))}
        </ul>
      </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      
      </footer>
    </div>

  );}
