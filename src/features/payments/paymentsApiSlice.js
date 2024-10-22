import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const paymentsAdapter = createEntityAdapter({});

const initialState = paymentsAdapter.getInitialState();

export const paymentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query({
      query: () => ({
        url: "/payments",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedPayments = responseData.map((payment) => {
          payment.id = payment._id;
          return payment;
        });
        return paymentsAdapter.setAll(initialState, loadedPayments);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Payment", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Payment", id })),
          ];
        } else return [{ type: "Payment", id: "LIST" }];
      },
    }),
    addNewPayment: builder.mutation({
      query: (initialPaymentData) => ({
        url: "/payments",
        method: "POST",
        body: {
          ...initialPaymentData,
        },
      }),
      invalidatesTags: [
        { type: "Payment", id: "LIST" },
        { type: "Stall", id: "LIST" },
        { type: "Rental", id: "LIST" },
      ],
    }),
    updatePayment: builder.mutation({
      query: (initialPaymentData) => ({
        url: "/payments",
        method: "PATCH",
        body: {
          ...initialPaymentData,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Payment", id: arg.id },
      ],
    }),
    deletePayment: builder.mutation({
      query: ({ id }) => ({
        url: `/payments`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Payment", id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useAddNewPaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
} = paymentsApiSlice;

export const selectPaymentsResult =
  paymentsApiSlice.endpoints.getPayments.select();

const selectPaymentsData = createSelector(
  selectPaymentsResult,
  (paymentsResult) => paymentsResult.data
);

export const selectPaymentsByStallId = (state, stallId) =>
  selectAllPayments(state).filter((payment) => payment.stall === stallId);

export const {
  selectAll: selectAllPayments,
  selectById: selectPaymentById,
  selectIds: selectPaymentIds,
} = paymentsAdapter.getSelectors(
  (state) => selectPaymentsData(state) ?? initialState
);
