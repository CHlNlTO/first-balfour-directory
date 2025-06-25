// src/lib/pagination.ts
export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
}

export interface PaginatedData<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function paginateArray<T>(
  array: T[],
  page: number,
  pageSize: number
): PaginatedData<T> {
  const total = array.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const data = array.slice(startIndex, endIndex);

  return {
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

export function generatePageNumbers(
  currentPage: number,
  totalPages: number,
  delta: number = 2
): (number | "ellipsis")[] {
  const range: number[] = [];
  const rangeWithDots: (number | "ellipsis")[] = [];

  // Handle edge cases
  if (totalPages <= 1) return [1];

  for (
    let i = Math.max(2, currentPage - delta);
    i <= Math.min(totalPages - 1, currentPage + delta);
    i++
  ) {
    range.push(i);
  }

  if (currentPage - delta > 2) {
    rangeWithDots.push(1, "ellipsis");
  } else {
    rangeWithDots.push(1);
  }

  rangeWithDots.push(...range);

  if (currentPage + delta < totalPages - 1) {
    rangeWithDots.push("ellipsis", totalPages);
  } else if (totalPages > 1) {
    rangeWithDots.push(totalPages);
  }

  return rangeWithDots;
}
