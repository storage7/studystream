import { useState, useEffect, useCallback } from 'react';
import { Batch } from '../types';
import { fetchBatches } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export function useBatches() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, logout } = useAuth();

  const load = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBatches();
      setBatches(data.batches as Batch[]);
    } catch (err: unknown) {
      const apiErr = err as { status?: number; message?: string };
      if (apiErr.status === 401) {
        logout();
      } else {
        setError(apiErr.message || 'Failed to load batches');
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, logout]);

  useEffect(() => {
    load();
  }, [load]);

  return { batches, loading, error, reload: load };
}
