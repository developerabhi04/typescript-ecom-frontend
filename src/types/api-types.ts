import { CartItem, Coupon, Order, Product, Review, ShippingInfo, Stats, User } from "./types";



export type CustomError = {
    status: number;
    data: {
        message: string;
        success: boolean;
    }
}


export type MessageResponse = {
    success: boolean;
    message: string;
}

export type UserResponse = {
    success: boolean;
    user: User;
}

export type AllProductsResponse = {
    success: boolean;
    products: Product[];
}



export type CategoriesResponse = {
    success: boolean;
    categories: string[];
}

export type SearchProductsResponse = {
    success: boolean;
    products: Product[];
    totalPage: number;
}
// or
// export type SearchProductsResponse = AllProductsResponse & {
//     totalPage: number;
// }

export type SearchProductsRequest = {
    price: number;
    page: number;
    category: string;
    search: string;
    sort: string;
}

export type ProductResponse = {
    success: boolean;
    product: Product;
}


export type NewProductRequest = {
    id: string;
    formData: FormData;
}

export type UpdateProductRequest = {
    userId: string;
    productId: string;
    formData: FormData;
}
export type DeleteProductRequest = {
    userId: string;
    productId: string;
}

export type NewOrderRequest = {
    shippingInfo: ShippingInfo;
    orderItems: CartItem[];
    subtotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    user: string;
}

export type AllOrdersResponse = {
    success: boolean;
    orders: Order[];
}
export type OrderDetailsResponse = {
    success: boolean;
    order: Order;
}

export type UpdateOrderRequest = {
    userId: string;
    orderId: string;
}


export type AllUsersResponse = {
    success: boolean;
    users: User[];
};

export type DeleteUserRequest = {
    userId: string;
    adminUserId: string;
};


export type StatsResponse = {
    success: boolean;
    stats: Stats;
};


export type PieResponse = {
    success: boolean;
    charts: Pie;
};

export type BarResponse = {
    success: boolean;
    charts: Bar;
};

export type LineResponse = {
    success: boolean;
    charts: Line;
};



type OrderFullfillment = {
    processing: number;
    shipped: number;
    delivered: number;
};

type RevenueDistribution = {
    netMargin: number;
    discount: number;
    productionCost: number;
    burnt: number;
    marketingCost: number;
};

type UsersAgeGroup = {
    teen: number;
    adult: number;
    old: number;
};

export type Pie = {
    orderFullfillment: OrderFullfillment;
    productCategories: Record<string, number>[];
    stockAvailablity: {
        inStock: number;
        outOfStock: number;
    };
    revenueDistribution: RevenueDistribution;
    userAgeGroup: UsersAgeGroup;
    adminCustomer: {
        admin: number;
        customer: number;
    };
};

export type Bar = {
    users: number[];
    products: number[];
    orders: number[];
};
export type Line = {
    users: number[];
    products: number[];
    discount: number[];
    revenue: number[];
};






// export type AllDiscountResponse = {
//     success: boolean;
//     coupons: CouponType[];
// };

export type AllDiscountResponse = {
    success: boolean;
    coupons: Coupon[];
}

export type SingleDiscountResponse = {
    success: boolean;
    coupon: {
        code: string;
        amount: number;
        _id: string;
    }
};

export type UpdateDiscountRequest = {
    userId: string;
    couponId: string;
    couponData: {
        code: string;
        amount: string;
    };
}

export type NewDiscountRequest = {
    id: string;
    code: string;
    amount: number;
}

export type DeleteDiscountRequest = {
    userId: string;
    couponId: string;
}




export type AllReviewsResponse = {
    success: boolean;
    reviews: Review[];
};


export type NewReviewRequest = {
    rating: number;
    comment: string;
    userId?: string;
    productId: string;
};



export type DeleteReviewRequest = {
    userId?: string;
    reviewId: string;
};

