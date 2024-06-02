import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react'
import { IUser, IUserResponse } from 'src/models/IUser'
import { baseQueryWithReauth } from '../axios'
import { setUser } from '../reducers/UserSlice'
// maxRetries: 5 is the default, and can be omitted. Shown for documentation purposes.
// const staggeredBaseQuery = retry(fetchBaseQuery({ baseUrl: '/' }), {
//   maxRetries: 5,
// })
export const userApi = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (build) => ({
    getUsers: build.query<IUser[], number>({
      query: (limit:number=5) => ({ 
        url: 'users',
        params:{
            _limit:limit
        }
    }),
    }),
    getMe: build.query<IUserResponse, null>({
      query() {
        return {
          url: 'user/me',
          credentials: 'include',
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const data  = await queryFulfilled;
          dispatch(setUser(data.data.user));
        } catch (error) {}
      },
    }),
    // getPost: build.query<PostsResponse, string>({
    //   query: (id) => ({ url: `post/${id}` }),
    //   extraOptions: { maxRetries: 8 }, // You can override the retry behavior on each endpoint
    // }),
  }),
})

export const { useGetUsersQuery } = userApi