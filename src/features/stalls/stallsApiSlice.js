import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const stallsAdapter = createEntityAdapter({});

const initialState = stallsAdapter.getInitialState();

export const stallsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStalls: builder.query({
      query: () => "/stalls",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      keepUnusedDataFor: 5,
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
  }),
});

export const { useGetStallsQuery } = stallsApiSlice;

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
