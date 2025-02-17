'use client'

import { 
  Box,
  TextField,
  Button,
  Paper
} from '@mui/material';
import Link from 'next/link';
import { createEntity } from '@/lib/api/entityActions';
import { useNotification } from '@/contexts/NotificationContext';
import { useActionState, useEffect } from "react";
import { useRouter } from 'next/navigation';

interface Metadata {
  entityName: string;
  search: {
    name: {
      indexType: number;
      attributes: string[];
    };
  };
  attributes: {
    [key: string]: {
      type: string;
    };
  };
  transactions: Record<string, unknown>;
  customTemplate: string;
}

interface CatalogFormProps {
  metadata: Metadata;
  appName: string;
  catalog: string;
}

interface FormState {
  success: boolean;
  message: string;
}

export function CatalogForm({ metadata, appName, catalog }: CatalogFormProps) {
  const { setNotification } = useNotification();
  const router = useRouter();
  const initialState: FormState = {
    success: false,
    message: ''
  };

  const [state, formAction] = useActionState(createEntity.bind(null, appName, catalog), initialState);

  useEffect(() => {
    if (state.success) {
      setNotification(state.message, 'success');
      router.push(`/apps/${appName}/run/catalog/${catalog}`);
    }
  }, [state]);

  return (
    <Paper sx={{ p: 3 }}>
      <Box 
        component="form" 
        action={formAction} 
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        {Object.entries(metadata.attributes).map(([key, value]) => (
          <TextField
            key={key}
            label={key}
            name={key}
            type={value.type === 'number' ? 'number' : 'text'}
            required
            fullWidth
          />
        ))}
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Link href={`/apps/${appName}/run/catalog/${catalog}`} style={{ textDecoration: 'none' }}>
            <Button variant="outlined">
              Cancel
            </Button>
          </Link>
          <Button type="submit" variant="contained" color="primary">
            Create
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}
