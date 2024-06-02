
import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query'
// import { tokenReceived, loggedOut } from './authSlice'
import { Mutex } from 'async-mutex'
import { ILoginResponse } from 'src/store/features/auth/AuthApi';
import { logout } from './reducers/UserSlice';

export const API_URL = "http://localhost:3000/api/"
const mutex = new Mutex()
const baseQuery = fetchBaseQuery({ baseUrl: API_URL,
  prepareHeaders(headers, api) {
    const accessToken = localStorage.getItem('token');
    headers.set("Authorization",`Bearer ${accessToken}`);
  },
})
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock()
  let result = await baseQuery(args, api, extraOptions)
  
  
  if (result.error && result.error.status === 401) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()
      try {
        const refreshResult = await baseQuery(
          { credentials: 'include', url: 'user/refresh_token',method:"POST" },
          api,
          extraOptions
        )
        
        if (refreshResult.data) {
          const loginResponse = refreshResult.data as ILoginResponse;
          const accessToken = loginResponse.access_token;
          localStorage.setItem('token', accessToken);
          result = await baseQuery(args, api, extraOptions)
        } else {
          
        }
      } 
      finally {
        localStorage.removeItem("token");
          api.dispatch(logout());
        // release must be called once the mutex should be released again.
        release()
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock()
      result = await baseQuery(args, api, extraOptions)
      
    }
  }
 
  return result
}