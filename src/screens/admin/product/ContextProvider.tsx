import React, { createContext, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import { IObj } from "@/types/types";

export interface IContextProductAdmin {
  filters: IObj;
  setFilters: (filters: IObj) => void;
  debouncedFilters: IObj;
}
export const ContextProductAdmin = createContext<IContextProductAdmin>({
  filters: {},
  setFilters(filters) {},
  debouncedFilters: {},
});

const ContextProductAdminProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [filters, setFilters] = useState<IObj>({
  });
  const debouncedFilters = useDebounce<IObj>(filters, 1500);
  return (
    <ContextProductAdmin.Provider
      value={{
        debouncedFilters: debouncedFilters,
        filters,
        setFilters,
      }}
    >
      {children}
    </ContextProductAdmin.Provider>
  );
};

export default ContextProductAdminProvider;
