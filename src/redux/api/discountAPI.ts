import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllDiscountResponse, DeleteDiscountRequest, MessageResponse, NewDiscountRequest, SingleDiscountResponse, UpdateDiscountRequest } from "../../types/api-types";



export const discountAPI = createApi({
    reducerPath: "discountApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/payment` }),

    tagTypes: ["Discount"],
    endpoints: (builder) => ({

        allDiscounts: builder.query<AllDiscountResponse, string>({
            query: (id) => `/coupon/all?id=${id}`,
            providesTags: ["Discount"],
        }),

        discountsDetails: builder.query<SingleDiscountResponse, string>({
            query: (id) => `/coupon/${id}`,
            providesTags: ["Discount"],
        }),


        newDiscount: builder.mutation<MessageResponse, NewDiscountRequest>({
            query: ({ id, code, amount }) => ({
                url: `/coupon/new?id=${id}`,
                method: "POST",
                body: { code, amount },
            }),
            invalidatesTags: ["Discount"],
        }),

        updateDiscounts: builder.mutation<MessageResponse, UpdateDiscountRequest>({
            query: ({ userId, couponData, couponId }) => ({
                url: `/coupon/${couponId}?id=${userId}`,
                method: "PUT",
                body: couponData, // Directly pass the plain object
            }),
            invalidatesTags: ["Discount"],
        }),


        deleteDiscounts: builder.mutation<MessageResponse, DeleteDiscountRequest>({
            query: ({ userId, couponId }) => ({
                url: `/coupon/${couponId}?id=${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Discount"],
        }),
    })
})


export const {
    useAllDiscountsQuery,
    useDiscountsDetailsQuery,
    useUpdateDiscountsMutation,
    useNewDiscountMutation,
    useDeleteDiscountsMutation,
} = discountAPI;
