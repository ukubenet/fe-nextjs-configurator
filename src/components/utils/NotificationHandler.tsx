'use client'

import { useNotification } from '@/contexts/NotificationContext';
import { useEffect } from 'react';

export function NotificationHandler() {
  const { showNotification } = useNotification();

  useEffect(() => {
    showNotification();
  }, []);

  return null;
}
