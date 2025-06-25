// src/hooks/useServerPagination.ts
import { useState, useEffect, useCallback } from "react";
import { fetchPersonsPaginated } from "@/lib/api";
import { Persons } from "@/lib/types";

interface UseServerPaginationProps {
  initialPageSize?: number;
  search?: string;
  department?: string;
  position?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface ServerPaginationState {
  data: Persons[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function useServerPagination({
  initialPageSize = 10,
  search = "",
  department = "",
  position = "",
  sortBy = "id",
  sortOrder = "asc",
}: UseServerPaginationProps) {
  const [state, setState] = useState<ServerPaginationState>({
    data: [],
    loading: true,
    error: null,
    pagination: {
      page: 1,
      pageSize: initialPageSize,
      total: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    },
  });

  const fetchData = useCallback(
    async (page: number, pageSize: number) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const result = await fetchPersonsPaginated({
          page,
          pageSize,
          search: search || undefined,
          department: department || undefined,
          position: position || undefined,
          sortBy,
          sortOrder,
        });

        setState((prev) => ({
          ...prev,
          data: result.data,
          pagination: result.pagination,
          loading: false,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error:
            error instanceof Error ? error.message : "Failed to fetch data",
          loading: false,
        }));
      }
    },
    [search, department, position, sortBy, sortOrder]
  );

  useEffect(() => {
    fetchData(1, state.pagination.pageSize);
  }, [fetchData]);

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= state.pagination.totalPages) {
        fetchData(page, state.pagination.pageSize);
      }
    },
    [fetchData, state.pagination.totalPages, state.pagination.pageSize]
  );

  const goToNextPage = useCallback(() => {
    if (state.pagination.hasNext) {
      fetchData(state.pagination.page + 1, state.pagination.pageSize);
    }
  }, [
    fetchData,
    state.pagination.hasNext,
    state.pagination.page,
    state.pagination.pageSize,
  ]);

  const goToPrevPage = useCallback(() => {
    if (state.pagination.hasPrev) {
      fetchData(state.pagination.page - 1, state.pagination.pageSize);
    }
  }, [
    fetchData,
    state.pagination.hasPrev,
    state.pagination.page,
    state.pagination.pageSize,
  ]);

  const changePageSize = useCallback(
    (newPageSize: number) => {
      fetchData(1, newPageSize);
    },
    [fetchData]
  );

  const refetch = useCallback(() => {
    fetchData(state.pagination.page, state.pagination.pageSize);
  }, [fetchData, state.pagination.page, state.pagination.pageSize]);

  return {
    ...state,
    goToPage,
    goToNextPage,
    goToPrevPage,
    changePageSize,
    refetch,
  };
}
