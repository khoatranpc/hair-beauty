import { RootState } from "@/store";
import { GenericState } from "@/utils/createGenericSlice";
import { useDispatch, useSelector } from "react-redux";

interface CrudCallbacks {
  onSuccess?: (
    data: any,
    type: "read" | "create" | "update" | "delete"
  ) => void;
  onError?: (
    error: { message: string; data?: any },
    type: "read" | "create" | "update" | "delete"
  ) => void;
}
const handleError = (error: any) => {
  return {
    message: error.message || "An unknown error occurred",
  };
};
export const useCrud = <T>(
  sliceName: keyof RootState,
  {
    fetchData,
    createData,
    updateData,
    deleteData,
  }: { fetchData?: any; createData?: any; updateData?: any; deleteData?: any },
  callbacks?: CrudCallbacks
) => {
  const dispatch = useDispatch();
  const { error, list, loading, single } = useSelector(
    (state: RootState) => state[sliceName] as GenericState
  );

  const create = async (data: Partial<T>, headers?: Record<string, string>) => {
    try {
      const result = await dispatch(createData({ data, headers })).unwrap();
      callbacks?.onSuccess?.(result, "create");
      return result;
    } catch (error) {
      const formattedError = handleError(error);
      callbacks?.onError?.(formattedError, "create");
      throw formattedError;
    }
  };

  const fetch = async (config?: any) => {
    try {
      const result = await dispatch(fetchData(config)).unwrap();
      callbacks?.onSuccess?.(result, "read");
      return result;
    } catch (error) {
      const formattedError = handleError(error);
      callbacks?.onError?.(formattedError, "read");
      throw formattedError;
    }
  };

  const update = async (
    id: string | number,
    data: Partial<T>,
    headers?: Record<string, string>
  ) => {
    try {
      const result = await dispatch(updateData({ id, data, headers })).unwrap();
      callbacks?.onSuccess?.(result, "update");
      return result;
    } catch (error) {
      callbacks?.onError?.(error as any, "update");
      throw error;
    }
  };

  const remove = async (
    id: string | number,
    headers?: Record<string, string>
  ) => {
    try {
      const result = await dispatch(deleteData({ id, headers })).unwrap();
      callbacks?.onSuccess?.(result, "delete");
      return result;
    } catch (error) {
      callbacks?.onError?.(error as any, "delete");
      throw error;
    }
  };

  return {
    list,
    single,
    loading,
    error,
    fetch,
    create,
    update,
    remove,
  };
};
