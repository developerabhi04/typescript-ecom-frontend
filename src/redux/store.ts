import { configureStore } from "@reduxjs/toolkit";
import { userAPI } from "./api/userAPI";
import { userReducer } from "./reducer/userReducer";
import { productAPI } from "./api/productAPI";
import { cartReducer } from "./reducer/cartReducer";
import { orderAPI } from "./api/orderAPI";
import { dashboardApi } from "./api/dashboardAPI";
import { discountAPI } from "./api/discountAPI";



export const server = import.meta.env.VITE_SERVER;




export const store = configureStore({
    reducer: {
        [userAPI.reducerPath]: userAPI.reducer,
        [productAPI.reducerPath]: productAPI.reducer,
        [discountAPI.reducerPath]: discountAPI.reducer,
        [orderAPI.reducerPath]: orderAPI.reducer,
        [dashboardApi.reducerPath]: dashboardApi.reducer,

        [userReducer.name]: userReducer.reducer,
        [cartReducer.name]: cartReducer.reducer,
    },
    middleware: (mid) => [...mid(),
    userAPI.middleware,
    productAPI.middleware,
    discountAPI.middleware,
    orderAPI.middleware,
    dashboardApi.middleware,
    ],
    
})

export type RootState = ReturnType<typeof store.getState>