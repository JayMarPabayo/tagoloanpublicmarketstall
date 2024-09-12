import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const sectionsAdapter = createEntityAdapter({});

const initialState = sectionsAdapter.getInitialState();

export const sectionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSections: builder.query({
      query: () => ({
        url: "/sections",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedSections = responseData.map((section) => {
          section.id = section._id;
          return section;
        });
        return sectionsAdapter.setAll(initialState, loadedSections);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Section", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Section", id })),
          ];
        } else return [{ type: "Section", id: "LIST" }];
      },
    }),
    addNewSection: builder.mutation({
      query: (initialSectionData) => ({
        url: "/sections",
        method: "POST",
        body: {
          ...initialSectionData,
        },
      }),
      invalidatesTags: [
        { type: "Section", id: "LIST" },
        { type: "Stall", id: "LIST" },
      ],
    }),
    updateSection: builder.mutation({
      query: (initialSectionData) => ({
        url: "/sections",
        method: "PATCH",
        body: {
          ...initialSectionData,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Section", id: arg.id },
      ],
    }),
    deleteSection: builder.mutation({
      query: ({ id }) => ({
        url: `/sections`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Section", id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetSectionsQuery,
  useAddNewSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
} = sectionsApiSlice;

export const selectSectionsResult =
  sectionsApiSlice.endpoints.getSections.select();

const selectSectionsData = createSelector(
  selectSectionsResult,
  (sectionsResult) => sectionsResult.data
);

export const {
  selectAll: selectAllSections,
  selectById: selectSectionById,
  selectIds: selectSectionIds,
} = sectionsAdapter.getSelectors(
  (state) => selectSectionsData(state) ?? initialState
);
