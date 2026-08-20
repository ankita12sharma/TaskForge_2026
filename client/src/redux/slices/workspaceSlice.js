import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const workspaceSlice = createApi({
  reducerPath: "workspaceSlice",

  baseQuery: fetchBaseQuery({
    baseUrl: "https://taskforge-2026.onrender.com",
  }),

  tagTypes: ["WorkSpace"],

  endpoints: (builder) => ({
    getWorkspaces: builder.query({
      query: () => "/getspace",
      providesTags: ["WorkSpace"],
    }),

    getWorkspaceById: builder.query({
      query: (id) => `/workspace/${id}`,
      providesTags: ["WorkSpace"],
    }),

    createWorkspace: builder.mutation({
      query: (newdata) => ({
        url: "/createspace",
        method: "POST",
        body: newdata,
      }),

      invalidatesTags: ["WorkSpace"],
    }),

    updateWorkspace: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `/editworkspace/${id}`,
        method: "PUT",
        body: updatedData,
      }),

      invalidatesTags: ["WorkSpace"],
    }),

    addMember: builder.mutation({
      query: ({ workspaceId, ...updatedData }) => ({
        url: `/addmember/${workspaceId}`,
        method: "PUT",
        body: updatedData,
      }),

      invalidatesTags: ["WorkSpace"],
    }),

    leaveWorkspace: builder.mutation({
      query: ({ workspaceId, userId }) => ({
        url: `/leaveworkspace/${workspaceId}`,
        method: "PUT",

        body: {
          userId,
        },
      }),

      invalidatesTags: ["WorkSpace"],
    }),

    deleteWorkspace: builder.mutation({
      query: (id) => ({
        url: `/deleteworkspace/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["WorkSpace"],
    }),
  }),
});

export const {
  useGetWorkspacesQuery,
  useGetWorkspaceByIdQuery,
  useCreateWorkspaceMutation,
  useUpdateWorkspaceMutation,
  useAddMemberMutation,
  useLeaveWorkspaceMutation,
  useDeleteWorkspaceMutation,
} = workspaceSlice;

export default workspaceSlice;
