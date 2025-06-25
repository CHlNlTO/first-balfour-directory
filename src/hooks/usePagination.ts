// src/hooks/usePagination.ts
import { useState, useMemo, useCallback } from "react";
import { paginateArray, PaginatedData } from "@/lib/pagination";

export function usePagination<T>(data: T[], initialPageSize: number = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const paginatedData = useMemo(() => {
    return paginateArray(data, currentPage, pageSize);
  }, [data, currentPage, pageSize]);

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= paginatedData.pagination.totalPages) {
        setCurrentPage(page);
      }
    },
    [paginatedData.pagination.totalPages]
  );

  const goToNextPage = useCallback(() => {
    if (paginatedData.pagination.hasNext) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [paginatedData.pagination.hasNext]);

  const goToPrevPage = useCallback(() => {
    if (paginatedData.pagination.hasPrev) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [paginatedData.pagination.hasPrev]);

  const changePageSize = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  // Reset to first page when data changes significantly
  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    ...paginatedData,
    currentPage,
    pageSize,
    goToPage,
    goToNextPage,
    goToPrevPage,
    changePageSize,
    resetPagination,
  };
}
