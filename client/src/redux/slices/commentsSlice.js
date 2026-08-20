import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const commentSlice = createApi({
  reducerPath: "commentSlice",

  baseQuery: fetchBaseQuery({
    baseUrl: "https://taskforge-2026.onrender.com",
  }),

  tagTypes: ["Comments"],

  endpoints: (builder) => ({
    getCommentsByTask: builder.query({
      query: (taskId) => `/task/${taskId}`,
      providesTags: (result, error, taskId) => [
        { type: "Comments", id: taskId },
      ],
    }),

    getCommentById: builder.query({
      query: (id) => `/comments/${id}`,
      providesTags: ["Comments"],
    }),

    createComment: builder.mutation({
      query: (commentData) => ({
        url: "/createcomments",
        method: "POST",
        body: commentData,
      }),
      invalidatesTags: ["Comments"],
    }),

    updateComment: builder.mutation({
      query: ({ id, ...editData }) => ({
        url: `/updatecom/${id}`,
        method: "PUT",
        body: editData,
      }),
      invalidatesTags: ["Comments"],
    }),

    deleteComment: builder.mutation({
      query: (id) => ({
        url: `/deletecomment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comments"],
    }),

    addReply: builder.mutation({
      query: ({ commentId, ...replyData }) => ({
        url: `/${commentId}/reply`,
        method: "POST",
        body: replyData,
      }),
      invalidatesTags: ["Comments"],
    }),

    deleteReply: builder.mutation({
      query: ({ commentId, replyId }) => ({
        url: `/${commentId}/reply/${replyId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comments"],
    }),
  }),
});

export const {
  useGetCommentsByTaskQuery,
  useGetCommentByIdQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useAddReplyMutation,
  useDeleteReplyMutation,
} = commentSlice;

export default commentSlice;
