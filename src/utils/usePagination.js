import { useState } from "react";

export default function usePagination() {
  const [paginationParams, setPaginationParams] = useState({
    pageSize: 10,
    currentPage: 1,
    total: 10,
  });

  const changePaginationParams = (data) => {
    setPaginationParams({
      ...paginationParams,
      pageSize: data.size,
      currentPage: data.page,
      total: data.total_pages * data.size,
    });
  };

  const changePageHandler = (page) => {
    setPaginationParams({
      ...paginationParams,
      currentPage: page,
    });
  };

  return { paginationParams, changePageHandler, changePaginationParams };
}
