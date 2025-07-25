import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Collection, Category } from "@/lib/types";

interface FiltersState {
  collections: Collection[];
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: FiltersState = {
  collections: [],
  categories: [],
  loading: false,
  error: null,
};

export const fetchCollections = createAsyncThunk(
  "filters/fetchCollections",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/admin/collections");
      if (!response.ok) {
        throw new Error("Failed to fetch collections");
      }
      const data = await response.json();
      return data.collections || [];
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch collections"
      );
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "filters/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/admin/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      return data.categories || [];
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch categories"
      );
    }
  }
);

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.loading = false;
        state.collections = action.payload;
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default filtersSlice.reducer;
