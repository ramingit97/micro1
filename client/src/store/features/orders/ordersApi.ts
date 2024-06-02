import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react'
import { IUser, IUserResponse } from 'src/models/IUser'
import { baseQueryWithReauth } from '../../axios';
import { IOrder } from 'src/models/IOrder';
// maxRetries: 5 is the default, and can be omitted. Shown for documentation purposes.
// const staggeredBaseQuery = retry(fetchBaseQuery({ baseUrl: '/' }), {
//   maxRetries: 5,
// })
export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['ORDER', 'Post'],
  endpoints: (build) => ({
    getOrders: build.query<any, any>({
      query() {
        return {
          url: 'order/list',
          credentials: 'include',
          // params:{
          // _limit:10
          // }
        };
      },
      providesTags: ['ORDER']
    }),

    getOrder: build.query<any, any>({
      query(id:string) {
        return {
          url: `order/get/${id}`,
          credentials: 'include',
          // params:{
          // _limit:10
          // }
        };
      },
      providesTags: ['ORDER']
    }),

    createOrder: build.mutation<any, any>({
      query(data) {
        data.number2 = "1212"
        data.products = [  {
        "id": "2b8c5653-c255-454c-b51e-8832597849da",
        "name": "Product1",
        "count": 1
    },]
        return {
          url: 'order/create',
          method: 'POST',
          body: data,
          credentials: 'include',
        };
      },
      invalidatesTags: ['ORDER'],
    }),
    // getPost: build.query<PostsResponse, string>({
    //   query: (id) => ({ url: `post/${id}` }),
    //   extraOptions: { maxRetries: 8 }, // You can override the retry behavior on each endpoint
    // }),
  }),
})

export const { useGetOrdersQuery, useCreateOrderMutation, useLazyGetOrdersQuery,useGetOrderQuery } = ordersApi