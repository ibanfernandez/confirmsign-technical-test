import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE = 'https://api-sandbox.confirmsign.com/v4.0';

/**
 * Custom hook to fetch and manage a ConfirmSign thread.
 * @param {string} cfskey
 * @param {string} cfstoken
 */
export function useThread(cfskey, cfstoken) {
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchThread = useCallback(async () => {
    if (!cfskey || !cfstoken) return;

    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get(
        `${API_BASE}/threads/token/${cfskey}/${cfstoken}`
      );
      setThread(data);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Error al cargar el hilo.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [cfskey, cfstoken]);

  useEffect(() => {
    fetchThread();
  }, [fetchThread]);

  return { thread, loading, error, refetch: fetchThread };
}

/**
 * Custom hook to accept a ConfirmSign thread.
 */
export function useAcceptThread() {
  const [accepting, setAccepting] = useState(false);
  const [acceptError, setAcceptError] = useState(null);

  const acceptThread = useCallback(async (cfskey, cfstoken, threadData) => {
    setAccepting(true);
    setAcceptError(null);

    try {
      const { data } = await axios.post(
        `${API_BASE}/threads/token/${cfskey}/${cfstoken}/agreement/true`,
        threadData
      );
      return { success: true, data };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Error al aceptar el hilo.';
      setAcceptError(message);
      return { success: false, error: message };
    } finally {
      setAccepting(false);
    }
  }, []);

  return { acceptThread, accepting, acceptError, setAcceptError };
}