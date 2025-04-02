"use client";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

const useUrlQueryParams = <T extends { [key: string]: string }>() => {
  const searchParams = useSearchParams();

  const queryParams = useMemo(() => {
    const params: { [key: string]: string } = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params as T;
  }, [searchParams]);

  const queryString: string = useMemo(() => {
    return searchParams.toString() as string;
  }, [searchParams]);
  const creatQueryParams = (params: T, ignoreKeys?: string[]) => {
    const queryParams = new URLSearchParams();
    for (const key in params) {
      if (ignoreKeys?.includes(key)) continue;
      queryParams.set(key, params[key]);
    }
    return queryParams.toString();
  };

  return {
    params: queryParams,
    queryString: String(queryString),
    searchParams,
    creatQueryParams,
  };
};
export default useUrlQueryParams;
