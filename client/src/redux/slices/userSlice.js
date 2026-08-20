import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userSlice = createApi({
  reducerPath: "userSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://taskforge-2026.onrender.com",
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/users",
      providesTags: ["Users"],
    }),
    signupUser: builder.mutation({
      query: (newdata) => ({
        url: "/signup",
        method: "POST",
        body: newdata,
      }),
      invalidatesTags: ["Users"],
    }),
    loginUser: builder.mutation({
      query: (newdata) => ({
        url: "/login",
        method: "POST",
        body: newdata,
      }),
      invalidatesTags: ["Users"],
    }),
    googleLogin: builder.mutation({
      query: (credential) => ({
        url: "/google-login",
        method: "POST",
        body: {
          credential,
        },
      }),
    }),
    updateUser: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `/edituser/${id}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: ["Users"],
    }),
    updateTheme: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `/edittheme/${id}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: ["Users"],
    }),
    guestLogin: builder.mutation({
      query: () => ({
        url: "/guest-login",
        method: "POST",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});
export const {
  useGetUsersQuery,
  useSignupUserMutation,
  useLoginUserMutation,
  useGoogleLoginMutation,
  useUpdateUserMutation,
  useUpdateThemeMutation,
  useGuestLoginMutation,
} = userSlice;
export default userSlice;
