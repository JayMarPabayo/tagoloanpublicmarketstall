import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const rentalsAdapter = createEntityAdapter({});

const initialState = rentalsAdapter.getInitialState();

export const rentalsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRentals: builder.query({
      query: () => ({
        url: "/rentals",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedRentals = responseData.map((rental) => {
          rental.id = rental._id;
          return rental;
        });
        return rentalsAdapter.setAll(initialState, loadedRentals);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Rental", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Rental", id })),
          ];
        } else return [{ type: "Rental", id: "LIST" }];
      },
    }),
    addNewRental: builder.mutation({
      query: (initialRentalData) => ({
        url: "/rentals",
        method: "POST",
        body: {
          ...initialRentalData,
        },
      }),
      invalidatesTags: [
        { type: "Rental", id: "LIST" },
        { type: "Stall", id: "LIST" },
      ],
    }),
    updateRental: builder.mutation({
      query: (initialRentalData) => ({
        url: "/rentals",
        method: "PATCH",
        body: {
          ...initialRentalData,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Rental", id: arg.id }],
    }),
    deleteRental: builder.mutation({
      query: ({ id }) => ({
        url: `/rentals`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Rental", id: arg.id }],
    }),
  }),
});

export const {
  useGetRentalsQuery,
  useAddNewRentalMutation,
  useUpdateRentalMutation,
  useDeleteRentalMutation,
} = rentalsApiSlice;

export const selectRentalsResult =
  rentalsApiSlice.endpoints.getRentals.select();

const selectRentalsData = createSelector(
  selectRentalsResult,
  (rentalsResult) => rentalsResult.data
);

export const selectRentalsByStallId = (state, stallId) =>
  selectAllRentals(state).filter((rental) => rental.stall === stallId);

export const {
  selectAll: selectAllRentals,
  selectById: selectRentalById,
  selectIds: selectRentalIds,
} = rentalsAdapter.getSelectors(
  (state) => selectRentalsData(state) ?? initialState
);
