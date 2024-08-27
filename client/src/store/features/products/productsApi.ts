import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '../../axios';
import { IProduct } from 'src/models/IProduct';
export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['ORDER', 'Post'],
  endpoints: (build) => ({

    createProduct: build.mutation<any, any>({
      query(data) {
        const formData = new FormData();
        // Добавляем обычные данные
        formData.append('name', data.name);
        formData.append('description', data.description);

        // Добавляем файлы, если они есть
        if (data.files && data.files.length > 0) {
          data.files.forEach((file: File, index: number) => {
            formData.append(`files`, file);
          });
        }

        // formData.append(`files`, data.files[0]);
        return {
          url: 'product/create',
          method: 'POST',
          body: formData,
          credentials: 'include',
        };
      },
      invalidatesTags: ['ORDER'],
    }),

    getProducts: build.query<IProduct[], any>({
      query() {
        return {
          url: 'product/list',
          credentials: 'include',
          // params:{
          // _limit:10
          // }
        };
      },
      providesTags: ['ORDER']
    }),
  }),
})

export const {useGetProductsQuery, useCreateProductMutation } = productsApi;