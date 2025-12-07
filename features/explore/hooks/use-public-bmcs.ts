'use client';

import { useAuth } from '@clerk/nextjs';
import { useCallback, useEffect, useState } from 'react';

export interface ApiBmcItem {
  tag: string;
  content: string;
}

export interface ApiBmcLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface ApiBmc {
  id: string;
  location: ApiBmcLocation | null;
  authorId: string;
  chatId: string;
  isPublic: boolean;
  items: ApiBmcItem[];
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  count?: number;
  data?: ApiBmc[];
  message?: string;
}

interface UsePublicBmcsReturn {
  bmcs: ApiBmc[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function usePublicBmcs(): UsePublicBmcsReturn {
  const [bmcs, setBmcs] = useState<ApiBmc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  const fetchBmcs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/v1/bmc/public`, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      const data: ApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch BMC data');
      }

      setBmcs(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch BMC data');
      setBmcs([]);
    } finally {
      setIsLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchBmcs();
  }, [fetchBmcs]);

  return {
    bmcs,
    isLoading,
    error,
    refetch: fetchBmcs,
  };
}
