import React, { createContext, useState, ReactNode } from "react";

// Define the shape of the context value
interface PaginationContextProps {
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
  setTotalPages: (totalPages: number) => void;
}

// Create the context
const PaginationContext = createContext<PaginationContextProps | undefined>(
  undefined
);

// Provider component
export const PaginationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPagesState] = useState<number>(1);

  // Function to set the current page
  const setPage = (page: number) => setCurrentPage(page);

  // Function to set the total number of pages
  const setTotalPages = (totalPages: number) => setTotalPagesState(totalPages);

  // Provide the context value to children
  return (
    <PaginationContext.Provider
      value={{ currentPage, totalPages, setPage, setTotalPages }}
    >
      {children}
    </PaginationContext.Provider>
  );
};

export default PaginationContext;
