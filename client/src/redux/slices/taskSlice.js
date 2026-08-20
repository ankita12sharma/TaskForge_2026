import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const taskSlice = createApi({
  reducerPath: "taskSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://taskforge-2026.onrender.com",
  }),
  tagTypes: ["Tasks"],
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: () => "/tasks",
      providesTags: ["Tasks"],
    }),
    getTaskById: builder.query({
      query: (id) => `/getbyid/${id}`,
      providesTags: ["Tasks"],
    }),
    createTask: builder.mutation({
      query: (newdata) => ({
        url: "/create",
        method: "POST",
        body: newdata,
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateTask: builder.mutation({
      query: ({ id, ...editData }) => ({
        url: `/updatetask/${id}`,
        method: "PUT",
        body: editData,
      }),
      invalidatesTags: ["Tasks"],
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/del/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),
  }),
});
export const {
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskSlice;
export default taskSlice;
