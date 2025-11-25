import { useCallback, useEffect, useRef, useState } from "react";
import apiData from "../api";

export type Contact = {
  id: string | number;
  firstNameLastName: string;
  jobTitle: string;
  emailAddress: string;
};

export function useContacts() {
  const [data, setData] = useState<Contact[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(
    () => new Set()
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastAppendRef = useRef(false);

  const fetchBatch = useCallback(async (append: boolean) => {
    setLoading(true);
    setError(null);
    lastAppendRef.current = append;
    try {
      const newData = await apiData();
      setData((prev) => (append ? [...prev, ...newData] : newData));
    } catch (e: any) {
      setError(e?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBatch(false);
  }, [fetchBatch]);

  const loadMore = useCallback(() => {
    setTimeout(() => {
      if (!loading) {
        fetchBatch(true);
      }
    });
  }, [fetchBatch, loading]);

  const retry = useCallback(() => {
    if (!loading) {
      fetchBatch(lastAppendRef.current);
    }
  }, [fetchBatch, loading]);

  const toggleSelect = useCallback((id: string | number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return {
    contacts: data,
    loading,
    error,
    selectedCount: selectedIds.size,
    isSelected: (id: string | number) => selectedIds.has(id),
    toggleSelect,
    loadMore,
    retry,
  };
}
