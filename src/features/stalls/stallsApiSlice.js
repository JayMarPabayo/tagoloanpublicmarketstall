import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const stallsAdapter = createEntityAdapter({});

const initialState = stallsAdapter.getInitialState();

export const stallsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStalls: builder.query({
      query: () => ({
        url: "/stalls",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedStalls = responseData.map((stall) => {
          stall.id = stall._id;
          return stall;
        });
        return stallsAdapter.setAll(initialState, loadedStalls);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Stall", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Stall", id })),
          ];
        } else return [{ type: "Stall", id: "LIST" }];
      },
    }),
    getStallsBySection: builder.query({
      query: (sectionId) => ({
        url: `/stalls?section=${sectionId}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedStalls = responseData.map((stall) => {
          stall.id = stall._id;
          return stall;
        });
        return stallsAdapter.setAll(initialState, loadedStalls);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Stall", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Stall", id })),
          ];
        } else return [{ type: "Stall", id: "LIST" }];
      },
    }),
    addNewStall: builder.mutation({
      query: (initialStallData) => ({
        url: "/stalls",
        method: "POST",
        body: {
          ...initialStallData,
        },
      }),
      invalidatesTags: [{ type: "Stall", id: "LIST" }],
    }),
    updateStall: builder.mutation({
      query: (initialStallData) => ({
        url: "/stalls",
        method: "PATCH",
        body: {
          ...initialStallData,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Stall", id: arg.id }],
    }),
    deleteStall: builder.mutation({
      query: ({ id }) => ({
        url: `/stalls`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Stall", id: arg.id }],
    }),
  }),
});

export const {
  useGetStallsQuery,
  useGetStallsBySectionQuery,
  useAddNewStallMutation,
  useUpdateStallMutation,
  useDeleteStallMutation,
} = stallsApiSlice;

export const selectStallsResult = stallsApiSlice.endpoints.getStalls.select();

const selectStallsData = createSelector(
  selectStallsResult,
  (stallsResult) => stallsResult.data
);

export const {
  selectAll: selectAllStalls,
  selectById: selectStallById,
  selectIds: selectStallIds,
} = stallsAdapter.getSelectors(
  (state) => selectStallsData(state) ?? initialState
);
