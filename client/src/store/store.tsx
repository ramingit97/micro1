import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/UserSlice";
import orderReducer from "./reducers/orders/OrderSlice";
import { userApi } from "./features/UserApi";
import { authApi } from "./features/auth/AuthApi";
import { ordersApi } from "./features/orders/ordersApi";
import { productsApi } from "./features/products/productsApi";

const rootReducer = combineReducers({
    userReducer,
    orderReducer,
    [userApi.reducerPath]:userApi.reducer,
    [authApi.reducerPath]:authApi.reducer,
    [ordersApi.reducerPath]:ordersApi.reducer,
    [productsApi.reducerPath]:productsApi.reducer
});

export const setupStore = ()=>{
    return configureStore({
         reducer:rootReducer,
         middleware(getDefaultMiddleware) {
             return getDefaultMiddleware().concat(
                userApi.middleware,
                authApi.middleware,
                ordersApi.middleware,
                productsApi.middleware
             )
         },
    });
}


export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];