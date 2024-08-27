import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const vendorsAdapter = createEntityAdapter({});

const initialState = vendorsAdapter.getInitialState();

export const vendorsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVendors: builder.query({
      query: () => ({
        url: "/vendors",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedVendors = responseData.map((vendor) => {
          vendor.id = vendor._id;
          return vendor;
        });
        return vendorsAdapter.setAll(initialState, loadedVendors);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Vendor", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Vendor", id })),
          ];
        } else return [{ type: "Vendor", id: "LIST" }];
      },
    }),
    addNewVendor: builder.mutation({
      query: (initialVendorData) => ({
        url: "/vendors",
        method: "POST",
        body: {
          ...initialVendorData,
        },
      }),
      invalidatesTags: [{ type: "Vendor", id: "LIST" }],
    }),
    updateVendor: builder.mutation({
      query: (initialVendorData) => ({
        url: "/vendors",
        method: "PATCH",
        body: {
          ...initialVendorData,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Vendor", id: arg.id }],
    }),
    deleteVendor: builder.mutation({
      query: ({ id }) => ({
        url: `/vendors`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Vendor", id: arg.id }],
    }),
  }),
});

export const {
  useGetVendorsQuery,
  useAddNewVendorMutation,
  useUpdateVendorMutation,
  useDeleteVendorMutation,
} = vendorsApiSlice;

export const selectVendorsResult =
  vendorsApiSlice.endpoints.getVendors.select();

const selectVendorsData = createSelector(
  selectVendorsResult,
  (vendorsResult) => vendorsResult.data
);

export const {
  selectAll: selectAllVendors,
  selectById: selectVendorById,
  selectIds: selectVendorIds,
} = vendorsAdapter.getSelectors(
  (state) => selectVendorsData(state) ?? initialState
);
