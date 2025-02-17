'use client'

import { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';

type NotificationLevel = 'success' | 'error' | 'info' | 'warning';

interface NotificationContextType {
  message: string | null;
  level: NotificationLevel | null;
  showNotification: (message?: string, level?: NotificationLevel) => void;
  setNotification: (message: string, level: NotificationLevel) => void;
  clearNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  message: null,
  level: null,
  showNotification: () => {},
  setNotification: () => {},
  clearNotification: () => {},
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [level, setLevel] = useState<NotificationLevel | null>(null);

  const showNotification = (msg?: string, lvl?: NotificationLevel) => {
    if (msg && lvl) {
      toast[lvl](msg);
    } else if (message && level) {
      toast[level](message);
    }
    clearNotification();
  };

  const setNotification = (message: string, level: NotificationLevel) => {
    setMessage(message);
    setLevel(level);
  };

  const clearNotification = () => {
    setMessage(null);
    setLevel(null);
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        message, 
        level, 
        showNotification, 
        setNotification, 
        clearNotification 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
