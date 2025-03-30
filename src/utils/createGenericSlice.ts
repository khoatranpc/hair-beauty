import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosConfig";

export interface GenericState<T = any> {
  list: T[] | null;
  single: T | null;
  loading: {
    fetch: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  fetched: {
    fetch: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  error: {
    fetch: string | null;
    create: string | null;
    update: string | null;
    delete: string | null;
  };
}

interface Param {
  slugOrId?: string | number;
}

interface RequestConfig extends Param {
  params?: any;
  headers?: Record<string, string>;
}

export const createGenericSlice = <T>(name: string, endpoint: string) => {
  const initialState: GenericState<T> = {
    list: null,
    single: null,
    loading: {
      fetch: false,
      create: false,
      update: false,
      delete: false,
    },
    fetched: {
      fetch: false,
      create: false,
      update: false,
      delete: false,
    },
    error: {
      fetch: null,
      create: null,
      update: null,
      delete: null,
    },
  };

  const fetchData = createAsyncThunk(
    `${name}/fetchData`,
    async (config?: RequestConfig) => {
      try {
        const response = await axiosInstance.get(
          `${endpoint}${config?.slugOrId ? `/${config.slugOrId}` : ""}`,
          {
            params: config?.params,
            headers: config?.headers,
          }
        );
        return response.data;
      } catch (error: any) {
        throw error.response.data;
      }
    }
  );

  const createData = createAsyncThunk(
    `${name}/createData`,
    async ({
      data,
      headers,
    }: {
      data: Partial<T>;
      headers?: Record<string, string>;
    }) => {
      try {
        const response = await axiosInstance.post(endpoint, data, { headers });
        return response.data;
      } catch (error: any) {
        throw error.response.data;
      }
    }
  );

  const updateData = createAsyncThunk(
    `${name}/updateData`,
    async ({
      id,
      data,
      headers,
    }: {
      id: string | number;
      data: Partial<T>;
      headers?: Record<string, string>;
    }) => {
      try {
        const response = await axiosInstance.put(`${endpoint}/${id}`, data, {
          headers,
        });
        return response.data;
      } catch (error: any) {
        throw error.response.data;
      }
    }
  );

  const deleteData = createAsyncThunk(
    `${name}/deleteData`,
    async ({
      id,
      headers,
    }: {
      id: string | number;
      headers?: Record<string, string>;
    }) => {
      try {
        await axiosInstance.delete(`${endpoint}/${id}`, { headers });
        return id;
      } catch (error: any) {
        throw error.response.data;
      }
    }
  );

  const slice = createSlice({
    name,
    initialState,
    reducers: {
      clearData: (state) => {
        state.list = null;
        state.single = null;
        state.error = {
          fetch: null,
          create: null,
          update: null,
          delete: null,
        };
        state.loading = {
          fetch: false,
          create: false,
          update: false,
          delete: false,
        };
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchData.pending, (state) => {
          state.loading.fetch = true;
          state.error.fetch = null;
          state.fetched.fetch = false;
        })
        .addCase(fetchData.fulfilled, (state, action: PayloadAction<T[] | T>) => {
          state.loading.fetch = false;
          state.fetched.fetch = true;
          state.list = Array.isArray(action.payload) ? (action.payload as any) : (null as any);
          state.single = !Array.isArray(action.payload) ? (action.payload as any) : null;
        })
        .addCase(fetchData.rejected, (state, action) => {
          state.loading.fetch = false;
          state.fetched.fetch = true;
          state.error.fetch = action.error.message || "An error occurred";
        })

        .addCase(createData.pending, (state) => {
          state.loading.create = true;
          state.error.create = null;
          state.fetched.create = false;
        })
        .addCase(createData.fulfilled, (state, action: PayloadAction<T>) => {
          state.loading.create = false;
          state.fetched.create = true;
          state.single = action.payload as any;
          if (state.list) {
            state.list.push(action.payload as any);
          }
        })
        .addCase(createData.rejected, (state, action) => {
          state.loading.create = false;
          state.fetched.create = true;
          state.error.create = action.error.message || "An error occurred";
        })

        .addCase(updateData.pending, (state) => {
          state.loading.update = true;
          state.error.update = null;
          state.fetched.update = false;
        })
        .addCase(updateData.fulfilled, (state, action: PayloadAction<T>) => {
          state.loading.update = false;
          state.fetched.update = true;
          state.single = action.payload as any;
          if (state.list) {
            const index = state.list.findIndex(
              (item: any) => item._id === (action.payload as any)._id
            );
            if (index !== -1) {
              state.list[index] = action.payload as any;
            }
          }
        })
        .addCase(updateData.rejected, (state, action) => {
          state.loading.update = false;
          state.fetched.update = true;
          state.error.update = action.error.message || "An error occurred";
        })

        .addCase(deleteData.pending, (state) => {
          state.loading.delete = true;
          state.error.delete = null;
          state.fetched.delete = false;
        })
        .addCase(deleteData.fulfilled, (state, action) => {
          state.loading.delete = false;
          state.fetched.delete = true;
          state.single = null;
          if (state.list) {
            state.list = state.list.filter(
              (item: any) => item._id !== action.payload
            );
          }
        })
        .addCase(deleteData.rejected, (state, action) => {
          state.loading.delete = false;
          state.fetched.delete = true;
          state.error.delete = action.error.message || "An error occurred";
        });
    },
  });

  return {
    slice,
    fetchData,
    createData,
    updateData,
    deleteData,
  };
};
