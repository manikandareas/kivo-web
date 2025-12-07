'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ApiBmc } from './use-public-bmcs';

interface ApiResponse {
  success: boolean;
  data?: ApiBmc;
  message?: string;
}

interface UseBmcDetailReturn {
  bmc: ApiBmc | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useBmcDetail(bmcId: string): UseBmcDetailReturn {
  const [bmc, setBmc] = useState<ApiBmc | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBmc = useCallback(async () => {
    if (!bmcId) return;

    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/v1/bmc/${bmcId}`);
      const data: ApiResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch BMC data');
      }

      setBmc(data.data || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch BMC data');
      setBmc(null);
    } finally {
      setIsLoading(false);
    }
  }, [bmcId]);

  useEffect(() => {
    fetchBmc();
  }, [fetchBmc]);

  return {
    bmc,
    isLoading,
    error,
    refetch: fetchBmc,
  };
}
