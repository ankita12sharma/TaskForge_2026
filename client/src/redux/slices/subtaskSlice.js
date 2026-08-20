import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const subtaskSlice = createApi({
  reducerPath: "subtaskSlice",

  baseQuery: fetchBaseQuery({
    baseUrl: "https://taskforge-2026.onrender.com",
  }),

  tagTypes: ["Subtasks"],

  endpoints: (builder) => ({
    getSubtasks: builder.query({
      query: (taskId) => `/subtasks/${taskId}`,
      providesTags: ["Subtasks"],
    }),

    getSubtaskById: builder.query({
      query: (id) => `getbyid/${id}`,
      providesTags: ["Subtasks"],
    }),

    createSubtask: builder.mutation({
      query: (subtaskData) => ({
        url: "/createsubtask",
        method: "POST",
        body: subtaskData,
      }),
      invalidatesTags: ["Subtasks"],
    }),

    updateSubtask: builder.mutation({
      query: ({ id, ...editData }) => ({
        url: `/editsubtask/${id}`,
        method: "PUT",
        body: editData,
      }),
      invalidatesTags: ["Subtasks"],
    }),

    deleteSubtask: builder.mutation({
      query: (id) => ({
        url: `/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subtasks"],
    }),

    toggleSubtask: builder.mutation({
      query: (id) => ({
        url: `/toggle/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Subtasks"],
    }),
  }),
});

export const {
  useGetSubtasksQuery,
  useGetSubtaskByIdQuery,
  useCreateSubtaskMutation,
  useUpdateSubtaskMutation,
  useDeleteSubtaskMutation,
  useToggleSubtaskMutation,
} = subtaskSlice;

export default subtaskSlice;
