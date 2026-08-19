import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const projectSlice = createApi({
  reducerPath: "projectSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8666",
  }),
  tagTypes: ["Projects"],
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: () => "/projects",
      providesTags: ["Projects"],
    }),
    getProjectById: builder.query({
      query: (id) => `/getbyid/${id}`,
      providesTags: ["Projects"],
    }),
    createProject: builder.mutation({
      query: (newdata) => ({
        url: "/createproj",
        method: "POST",
        body: newdata,
      }),
      invalidatesTags: ["Projects"],
    }),
    updateProject: builder.mutation({
      query: ({ id, ...editData }) => ({
        url: `/editproj/${id}`,
        method: "PUT",
        body: editData,
      }),
      invalidatesTags: ["Projects"],
    }),
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/deleteproj/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects"],
    }),
  }),
});
export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectSlice;
export default projectSlice;
