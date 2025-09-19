import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const rtbdBaseUrl = process.env.EXPO_PUBLIC_RTDB_URL;

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: fetchBaseQuery({ baseUrl: rtbdBaseUrl }),
  endpoints: (builder) => ({
    getProfilePicture: builder.query({
      query: (locadId) => `profilePictures/${locadId}.json`,
    }),
    putProfilePicture: builder.mutation({
      query: (data) => ({
        url: `profilePictures/${data.localId}.json`,
        method: "PUT",
        body: {
          image: data.image,
        },
      }),
    }),
  }),
});

export const { useGetProfilePictureQuery, usePutProfilePictureMutation } =
  profileApi;
