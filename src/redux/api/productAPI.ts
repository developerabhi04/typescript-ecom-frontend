import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllProductsResponse, AllReviewsResponse, CategoriesResponse, DeleteProductRequest, DeleteReviewRequest, MessageResponse, NewProductRequest, NewReviewRequest, ProductResponse, SearchProductsRequest, SearchProductsResponse, UpdateProductRequest } from "../../types/api-types";



export const productAPI = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/` }),

    tagTypes: ["Product"],
    endpoints: (builder) => ({
        latestProduct: builder.query<AllProductsResponse, string>({
            query: () => "latest",
            providesTags: ["Product"],
        }),

        allProducts: builder.query<AllProductsResponse, string>({
            query: (id) => `admin-products?id=${id}`,
            providesTags: ["Product"],
        }),

        categories: builder.query<CategoriesResponse, string>({
            query: () => `categories`,
            providesTags: ["Product"],
        }),

        searchProducts: builder.query<SearchProductsResponse, SearchProductsRequest>({
            query: ({ price, search, sort, category, page }) => {
                let base = `all?search=${search}&page=${page}`;

                if (price) base += `&price=${price}`;
                if (sort) base += `&sort=${sort}`;
                if (category) base += `&category=${category}`;

                return base;
            },
            providesTags: ["Product"],
        }),

        productDetails: builder.query<ProductResponse, string>({
            query: (id) => id,
            providesTags: ["Product"],
        }),

        newProduct: builder.mutation<MessageResponse, NewProductRequest>({
            query: ({ formData, id }) => ({
                url: `new?id=${id}`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Product"],
        }),

        updateProduct: builder.mutation<MessageResponse, UpdateProductRequest>({
            query: ({ userId, formData, productId }) => ({
                url: `${productId}?id=${userId}`,
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ["Product"],
        }),

        deleteProduct: builder.mutation<MessageResponse, DeleteProductRequest>({
            query: ({ userId, productId }) => ({
                url: `${productId}?id=${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Product"],
        }),


        // review
        allReviewsOfProducts: builder.query<AllReviewsResponse, string>({
            query: (productId) => `reviews/${productId}`,
            providesTags: ["Product"],
        }),

        newReview: builder.mutation<MessageResponse, NewReviewRequest>({
            query: ({ comment, rating, productId, userId }) => ({
                url: `review/new/${productId}?id=${userId}`,
                method: "POST",
                body: { comment, rating },
                headers: {
                    "Content-Type": "application/json",
                },
            }),
            invalidatesTags: ["Product"],
        }),

        deleteReview: builder.mutation<MessageResponse, DeleteReviewRequest>({
            query: ({ reviewId, userId }) => ({
                url: `/review/${reviewId}?id=${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Product"],
        }),
    })
})


export const {
    useLatestProductQuery,
    useAllProductsQuery,
    useCategoriesQuery,
    useSearchProductsQuery,
    useProductDetailsQuery,
    useNewProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useAllReviewsOfProductsQuery,
    useNewReviewMutation,
    useDeleteReviewMutation,
} = productAPI;
