"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { IObj } from "@/types/types";
import useUrlQueryParams from "@/hooks/useUrlQueryParams";

export const BlogsManagmantContext = React.createContext<IObj>({});

const BlogsContextProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const queries = useUrlQueryParams();
  const path = usePathname();
  const firstRender = React.useRef(true);
  const [filters, setFilters] = React.useState<IObj>({
    search: "",
    page: 1,
    limit: 10,
    ...queries.params,
  });
  useEffect(() => {
    if (firstRender.current) {
      if (path.includes("blogs/list")) {
        router.push(`/blogs/list?${queries.creatQueryParams(filters)}`);
        firstRender.current = false;
      }
    }
  }, [filters]);

  return (
    <BlogsManagmantContext.Provider value={{ filters, setFilters }}>
      {children}
    </BlogsManagmantContext.Provider>
  );
};

export default BlogsContextProvider;
