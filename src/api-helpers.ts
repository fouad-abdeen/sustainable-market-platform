import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import {
  AdminMessageResponse,
  ApiResponse,
  AuthResponse,
  CartResponse,
  CategoryResponse,
  ItemCategoryResponse,
  SellerItemResponse,
  OrderResponse,
} from "./types/api-responses";
import {
  CartItemRequest,
  ItemQueryParams,
  OrderUpdateRequest,
  OrderQueryParams,
  SigninRequest,
  SignupRequest,
  CategoryCreateRequest,
  CategoryUpdateRequest,
  SellerItemUpdateRequest,
  SellerItemCreateRequest,
  CustomerProfileUpdateRequest,
  SellerProfileUpdateRequest,
  UpdatePasswordRequest,
  ResetPasswordRequest,
  AdminMessageRequest,
  SellersQueryParams,
  OrderPlacementRequest,
} from "./types/api-requests";
import { WishlistItem } from "./types/item";
import { SellerInfo, User } from "./types/user";

const defaultConfiguration = {
  baseUrl: "https://sustainabe-market-server.onrender.com",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

const get = async <R>(
  endpoint: string,
  requestConfiguration?: AxiosRequestConfig,
  refreshToken?: boolean
): Promise<ApiResponse<R>> => {
  let response = {} as ApiResponse<R>;

  if (refreshToken) {
    try {
      const response = await authApi.refreshToken(
        localStorage.getItem("accessToken") as string,
        localStorage.getItem("refreshToken") as string
      );

      const { accessToken } = response.data;

      localStorage.setItem("accessToken", accessToken);

      if (requestConfiguration) {
        if (requestConfiguration.headers) {
          requestConfiguration.headers.Authorization = accessToken;
        }

        if (requestConfiguration.params) {
          if (requestConfiguration.params.accessToken) {
            requestConfiguration.params.accessToken = accessToken;
          }
        }
      }
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return {} as ApiResponse<R>;
    }
  }

  await axios
    .get<ApiResponse<R>>(defaultConfiguration.baseUrl + endpoint, requestConfiguration)
    .then((axiosResponse) => {
      response = axiosResponse.data;
    })
    .catch((error: AxiosError) => {
      if (error.response) {
        response = error.response.data as ApiResponse<R>;
      }
    });

  if (response.status === "error") throw new Error(response.error.message);

  return response;
};

const post = async <T, R>(
  endpoint: string,
  data: T,
  requestConfiguration?: AxiosRequestConfig,
  refreshToken?: boolean
): Promise<ApiResponse<R>> => {
  let response = {} as ApiResponse<R>;

  if (refreshToken) {
    try {
      const response = await authApi.refreshToken(
        localStorage.getItem("accessToken") as string,
        localStorage.getItem("refreshToken") as string
      );

      const { accessToken } = response.data;

      localStorage.setItem("accessToken", accessToken);

      if (requestConfiguration) {
        if (requestConfiguration.headers) {
          requestConfiguration.headers.Authorization = accessToken;
        }
      }
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return {} as ApiResponse<R>;
    }
  }

  await axios
    .post<T, AxiosResponse<ApiResponse<R>>>(
      defaultConfiguration.baseUrl + endpoint,
      data,
      requestConfiguration
    )
    .then((axiosResponse) => {
      response = axiosResponse.data;
    })
    .catch((error: AxiosError) => {
      if (error.response) {
        response = error.response.data as ApiResponse<R>;
      }
    });

  if (response.status === "error") throw new Error(response.error.message);

  return response;
};

const put = async <T, R>(
  endpoint: string,
  data: T,
  requestConfiguration?: AxiosRequestConfig,
  refreshToken?: boolean
): Promise<ApiResponse<R>> => {
  let response = {} as ApiResponse<R>;

  if (refreshToken) {
    try {
      const response = await authApi.refreshToken(
        localStorage.getItem("accessToken") as string,
        localStorage.getItem("refreshToken") as string
      );

      const { accessToken } = response.data;

      localStorage.setItem("accessToken", accessToken);

      if (requestConfiguration) {
        if (requestConfiguration.headers) {
          requestConfiguration.headers.Authorization = accessToken;
        }
      }
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return {} as ApiResponse<R>;
    }
  }

  await axios
    .put<T, AxiosResponse<ApiResponse<R>>>(
      defaultConfiguration.baseUrl + endpoint,
      data,
      requestConfiguration
    )
    .then((axiosResponse) => {
      response = axiosResponse.data;
    })
    .catch((error: AxiosError) => {
      if (error.response) {
        response = error.response.data as ApiResponse<R>;
      }
    });

  if (response.status === "error") throw new Error(response.error.message);

  return response;
};

const requestDeletion = async <R>(
  endpoint: string,
  requestConfiguration?: AxiosRequestConfig,
  refreshToken?: boolean
): Promise<ApiResponse<R>> => {
  let response = {} as ApiResponse<R>;

  if (refreshToken) {
    try {
      const response = await authApi.refreshToken(
        localStorage.getItem("accessToken") as string,
        localStorage.getItem("refreshToken") as string
      );

      const { accessToken } = response.data;

      localStorage.setItem("accessToken", accessToken);

      if (requestConfiguration) {
        if (requestConfiguration.headers) {
          requestConfiguration.headers.Authorization = accessToken;
        }
      }
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return {} as ApiResponse<R>;
    }
  }

  await axios
    .delete<unknown, AxiosResponse<ApiResponse<R>>>(
      defaultConfiguration.baseUrl + endpoint,
      requestConfiguration
    )
    .then((axiosResponse) => {
      response = axiosResponse.data;
    })
    .catch((error: AxiosError) => {
      if (error.response) {
        response = error.response.data as ApiResponse<R>;
      }
    });

  if (response.status === "error") throw new Error(response.error.message);

  return response;
};

enum Routes {
  AUTH = "/auth",
  USER = "/users",
  CUSTOMER = "/customers",
  SELLER = "/sellers",
  ITEM = "/items",
  CATEGORY = "/categories",
  CART = "/cart",
  ORDER = "/orders",
  MESSAGE = "/messages",
}

const endpoints = {
  auth: {
    login: `${Routes.AUTH}/login`,
    logout: `${Routes.AUTH}/logout`,
    signup: `${Routes.AUTH}/signup`,
    emailVerification: `${Routes.AUTH}/email/verify`,
    passwordManagement: `${Routes.AUTH}/password`,
    userQuery: `${Routes.AUTH}/user`,
    tokenRefresh: `${Routes.AUTH}/token/refresh`,
  },
  user: {
    query: Routes.USER,
    acknowledge: (id: string) => `${Routes.USER}/${id}/acknowledge`,
    deny: (id: string) => `${Routes.USER}/${id}/deny`,
  },
  customer: {
    wishlistItemUpdate: (id: string) => `${Routes.CUSTOMER}/wishlist/items/${id}`,
    wishlistItemsQuery: `${Routes.CUSTOMER}/wishlist/items`,
    profileUpdate: `${Routes.CUSTOMER}/profile`,
  },
  seller: {
    query: Routes.SELLER,
    queryAll: `${Routes.SELLER}/all`,
    queryOne: (id: string) => `${Routes.SELLER}/${id}`,
    updateServiceCategory: (id: string, categoryId: string) =>
      `${Routes.SELLER}/${id}/categories/${categoryId}`,
    updateItemCategory: (id: string, categoryId: string) =>
      `${Routes.SELLER}/${id}/item-categories/${categoryId}`,
    getItemCategories: (id: string) => `${Routes.SELLER}/${id}/item-categories`,
    profileUpdate: `${Routes.SELLER}/profile`,
  },
  item: {
    action: Routes.ITEM,
    actionById: (id: string) => `${Routes.ITEM}/${id}`,
  },
  category: {
    categoriesAction: Routes.CATEGORY,
    categoriesActionById: (id: string) => `${Routes.CATEGORY}/${id}`,
    getDefaultItemCategory: `${Routes.CATEGORY}/item-category/default`,
  },
  cart: {
    cartAction: Routes.CART,
    cartItemsUpdate: `${Routes.CART}/items/`,
    cartItemDeletion: (id: string) => `${Routes.CART}/items/${id}`,
  },
  order: {
    ordersAction: (id?: string) => (id ? `${Routes.ORDER}/${id}` : Routes.ORDER),
  },
};

export const authApi = {
  signin: async (data: SigninRequest): Promise<ApiResponse<AuthResponse>> =>
    await post<SigninRequest, AuthResponse>(endpoints.auth.login, data, {
      headers: defaultConfiguration.headers,
    }),

  signout: async (accessToken: string, refreshToken: string): Promise<ApiResponse<unknown>> =>
    await get(
      endpoints.auth.logout,
      {
        headers: { ...defaultConfiguration.headers, Authorization: accessToken },
        params: { accessToken, refreshToken },
      },
      true
    ),

  signup: async (data: SignupRequest): Promise<ApiResponse<AuthResponse>> =>
    await post<SignupRequest, AuthResponse>(endpoints.auth.signup, data, {
      headers: defaultConfiguration.headers,
    }),

  verifyEmail: async (token: string): Promise<ApiResponse<unknown>> =>
    await put<unknown, unknown>(
      endpoints.auth.emailVerification,
      {},
      { headers: defaultConfiguration.headers, params: { token } }
    ),

  sendPasswordResetLink: async (email: string): Promise<ApiResponse<unknown>> =>
    await get<unknown>(endpoints.auth.passwordManagement, {
      headers: defaultConfiguration.headers,
      params: { email },
    }),

  resetPassword: async (data: ResetPasswordRequest): Promise<ApiResponse<unknown>> =>
    await post<ResetPasswordRequest, unknown>(endpoints.auth.passwordManagement, data, {
      headers: defaultConfiguration.headers,
    }),

  updatePassword: async (
    data: UpdatePasswordRequest,
    accessToken: string
  ): Promise<ApiResponse<unknown>> =>
    await put<UpdatePasswordRequest, unknown>(
      endpoints.auth.passwordManagement,
      data,
      { headers: { ...defaultConfiguration.headers, Authorization: accessToken } },
      true
    ),

  getAuhenticatedUser: async (accessToken: string): Promise<ApiResponse<User>> =>
    await get(
      endpoints.auth.userQuery,
      { headers: { ...defaultConfiguration.headers, Authorization: accessToken } },
      true
    ),

  refreshToken: async (
    accessToken: string,
    refreshToken: string
  ): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> =>
    await get(endpoints.auth.tokenRefresh, {
      headers: { ...defaultConfiguration.headers, Authorization: accessToken },
      params: { accessToken, refreshToken },
    }),
};

export const userApi = {
  query: async (accessToken: string): Promise<ApiResponse<User[]>> =>
    await get(
      endpoints.user.query,
      { headers: { ...defaultConfiguration.headers, Authorization: accessToken } },
      true
    ),

  acknowledge: async (id: string, accessToken: string): Promise<ApiResponse<unknown>> =>
    await put<unknown, unknown>(
      endpoints.user.acknowledge(id),
      {},
      { headers: { ...defaultConfiguration.headers, Authorization: accessToken } },
      true
    ),

  deny: async (id: string, accessToken: string): Promise<ApiResponse<unknown>> =>
    await put<unknown, unknown>(
      endpoints.user.deny(id),
      {},
      { headers: { ...defaultConfiguration.headers, Authorization: accessToken } },
      true
    ),
};

export const sellerApi = {
  query: async (params: SellersQueryParams): Promise<ApiResponse<SellerInfo[]>> =>
    await get(endpoints.seller.query, { headers: defaultConfiguration.headers, params }),

  queryOne: async (id: string): Promise<ApiResponse<SellerInfo>> =>
    await get(endpoints.seller.queryOne(id), { headers: defaultConfiguration.headers }),

  updateCategory: async (
    id: string,
    categoryId: string,
    accessToken: string
  ): Promise<ApiResponse<unknown>> =>
    await put<unknown, unknown>(
      endpoints.seller.updateServiceCategory(id, categoryId),
      {},
      { headers: { ...defaultConfiguration.headers, Authorization: accessToken } },
      true
    ),

  assignItemCategory: async (
    id: string,
    categoryId: string,
    accessToken: string
  ): Promise<ApiResponse<unknown>> =>
    await post<unknown, unknown>(
      endpoints.seller.updateItemCategory(id, categoryId),
      {},
      { headers: { ...defaultConfiguration.headers, Authorization: accessToken } },
      true
    ),

  removeItemCategory: async (
    id: string,
    categoryId: string,
    accessToken: string
  ): Promise<ApiResponse<unknown>> =>
    await requestDeletion(
      endpoints.seller.updateItemCategory(id, categoryId),
      { headers: { ...defaultConfiguration.headers, Authorization: accessToken } },
      true
    ),

  getItemCategories: async (id: string): Promise<ApiResponse<ItemCategoryResponse[]>> =>
    await get(endpoints.seller.getItemCategories(id), { headers: defaultConfiguration.headers }),

  updateProfile: async (
    data: SellerProfileUpdateRequest,
    accessToken: string
  ): Promise<ApiResponse<unknown>> =>
    await put<SellerProfileUpdateRequest, unknown>(
      endpoints.seller.profileUpdate,
      data,
      { headers: { ...defaultConfiguration.headers, Authorization: accessToken } },
      true
    ),
};

export const customerApi = {
  addItemToWishlist: async (id: string, accessToken: string): Promise<ApiResponse<unknown>> =>
    await post(
      endpoints.customer.wishlistItemUpdate(id),
      {},
      { headers: { ...defaultConfiguration.headers, Authorization: accessToken } },
      true
    ),

  removeItemFromWishlist: async (id: string, accessToken: string): Promise<ApiResponse<unknown>> =>
    await requestDeletion(
      endpoints.customer.wishlistItemUpdate(id),
      { headers: { ...defaultConfiguration.headers, Authorization: accessToken } },
      true
    ),

  getWishlistItems: async (accessToken: string): Promise<ApiResponse<WishlistItem[]>> =>
    await get(
      endpoints.customer.wishlistItemsQuery,
      { headers: { ...defaultConfiguration.headers, Authorization: accessToken } },
      true
    ),

  updateProfile: async (
    data: CustomerProfileUpdateRequest,
    accessToken: string
  ): Promise<ApiResponse<unknown>> =>
    await put<CustomerProfileUpdateRequest, unknown>(
      endpoints.customer.profileUpdate,
      data,
      { headers: { ...defaultConfiguration.headers, Authorization: accessToken } },
      true
    ),
};

export const itemApi = {
  getItems: async (params: ItemQueryParams): Promise<ApiResponse<SellerItemResponse[]>> =>
    await get(endpoints.item.action, { headers: defaultConfiguration.headers, params }),

  getItemById: async (id: string): Promise<ApiResponse<SellerItemResponse>> =>
    await get(endpoints.item.actionById(id), { headers: defaultConfiguration.headers }),

  createItem: async (
    item: SellerItemCreateRequest,
    accessToken: string
  ): Promise<ApiResponse<SellerItemResponse>> =>
    await post<SellerItemCreateRequest, SellerItemResponse>(
      endpoints.item.action,
      item,
      { headers: { ...defaultConfiguration.headers, Authorization: accessToken } },
      true
    ),

  updateItem: async (
    id: string,
    item: SellerItemUpdateRequest,
    accessToken: string
  ): Promise<ApiResponse<SellerItemResponse>> =>
    await put<SellerItemUpdateRequest, SellerItemResponse>(
      endpoints.item.actionById(id),
      item,
      { headers: { ...defaultConfiguration.headers, Authorization: accessToken } },
      true
    ),

  deleteItem: async (id: string, accessToken: string): Promise<ApiResponse<unknown>> =>
    await requestDeletion(
      endpoints.item.actionById(id),
      { headers: { ...defaultConfiguration.headers, Authorization: accessToken } },
      true
    ),
};

export const categoryApi = {
  getCategories: async (): Promise<ApiResponse<CategoryResponse[]>> =>
    await get(endpoints.category.categoriesAction, { headers: defaultConfiguration.headers }),

  getCategoryById: async (id: string): Promise<ApiResponse<CategoryResponse>> =>
    await get(endpoints.category.categoriesActionById(id), {
      headers: defaultConfiguration.headers,
    }),

  getDefaultItemCategory: async (): Promise<ApiResponse<CategoryResponse>> =>
    await get(endpoints.category.getDefaultItemCategory, { headers: defaultConfiguration.headers }),

  createCategory: async (
    category: CategoryCreateRequest,
    accessToken: string
  ): Promise<ApiResponse<CategoryResponse>> =>
    await post<{ name: string }, CategoryResponse>(
      endpoints.category.categoriesAction,
      category,
      { headers: { ...defaultConfiguration.headers, Authorization: accessToken } },
      true
    ),

  updateCategory: async (
    id: string,
    category: CategoryUpdateRequest,
    accessToken: string
  ): Promise<ApiResponse<CategoryResponse>> =>
    await put<CategoryUpdateRequest, CategoryResponse>(
      endpoints.category.categoriesActionById(id),
      category,
      { headers: { ...defaultConfiguration.headers, Authorization: accessToken } },
      true
    ),

  deleteCategory: async (id: string, accessToken: string): Promise<ApiResponse<unknown>> =>
    await requestDeletion(
      endpoints.category.categoriesActionById(id),
      { headers: { ...defaultConfiguration.headers, Authorization: accessToken } },
      true
    ),
};

export const cartApi = {
  getCart: async (accessToken: string): Promise<ApiResponse<CartResponse>> =>
    await get(
      endpoints.cart.cartAction,
      { headers: { ...defaultConfiguration.headers, Authorization: accessToken } },
      true
    ),

  clearCart: async (accessToken: string): Promise<ApiResponse<unknown>> =>
    await requestDeletion(
      endpoints.cart.cartAction,
      { headers: { ...defaultConfiguration.headers, Authorization: accessToken } },
      true
    ),

  addItemToCart: async (
    data: CartItemRequest,
    accessToken: string
  ): Promise<ApiResponse<unknown>> =>
    await post<CartItemRequest, CartResponse>(
      endpoints.cart.cartItemsUpdate,
      data,
      { headers: { ...defaultConfiguration.headers, Authorization: accessToken } },
      true
    ),

  updateItemInCart: async (
    data: CartItemRequest,
    accessToken: string
  ): Promise<ApiResponse<unknown>> =>
    await put<CartItemRequest, CartResponse>(
      endpoints.cart.cartItemsUpdate,
      data,
      { headers: { ...defaultConfiguration.headers, Authorization: accessToken } },
      true
    ),

  removeItemFromCart: async (id: string, accessToken: string): Promise<ApiResponse<unknown>> =>
    await requestDeletion(
      endpoints.cart.cartItemDeletion(id),
      { headers: { ...defaultConfiguration.headers, Authorization: accessToken } },
      true
    ),
};

export const orderApi = {
  getListOfOrders: async (
    params: OrderQueryParams,
    accessToken: string
  ): Promise<ApiResponse<OrderResponse[]>> =>
    await get(
      endpoints.order.ordersAction(),
      { headers: { ...defaultConfiguration.headers, Authorization: accessToken }, params },
      true
    ),

  placeOrder: async (
    data: OrderPlacementRequest,
    accessToken: string
  ): Promise<ApiResponse<OrderResponse>> =>
    await post<unknown, OrderResponse>(
      endpoints.order.ordersAction(),
      data,
      { headers: { ...defaultConfiguration.headers, Authorization: accessToken } },
      true
    ),

  updateOrder: async (
    data: OrderUpdateRequest,
    accessToken: string
  ): Promise<ApiResponse<OrderResponse>> =>
    await put<OrderUpdateRequest, OrderResponse>(
      endpoints.order.ordersAction(),
      data,
      { headers: { ...defaultConfiguration.headers, Authorization: accessToken } },
      true
    ),

  getOrder: async (id: string, accessToken: string): Promise<ApiResponse<OrderResponse>> =>
    await get(
      endpoints.order.ordersAction(id),
      { headers: { ...defaultConfiguration.headers, Authorization: accessToken } },
      true
    ),

  cancelOrder: async (id: string, accessToken: string): Promise<ApiResponse<unknown>> =>
    await requestDeletion(
      endpoints.order.ordersAction(id),
      { headers: { ...defaultConfiguration.headers, Authorization: accessToken } },
      true
    ),
};

export const messageApi = {
  submitMessage: async (data: AdminMessageRequest): Promise<ApiResponse<unknown>> =>
    await post<AdminMessageRequest, unknown>(Routes.MESSAGE, data, {
      headers: defaultConfiguration.headers,
    }),

  getMessages: async (accessToken: string): Promise<ApiResponse<AdminMessageResponse[]>> =>
    await get(
      Routes.MESSAGE,
      { headers: { ...defaultConfiguration.headers, Authorization: accessToken } },
      true
    ),

  deleteMessage: async (id: string, accessToken: string): Promise<ApiResponse<unknown>> =>
    await requestDeletion(
      `${Routes.MESSAGE}/${id}`,
      { headers: { ...defaultConfiguration.headers, Authorization: accessToken } },
      true
    ),
};

export const refreshAccessToken = async (accessToken: string, refreshToken: string) => {
  if (accessToken && refreshToken) {
    try {
      const response = await authApi.refreshToken(accessToken, refreshToken);

      if (response.status === "error") throw new Error(response.error.message);

      const { accessToken: newAccessToken } = response.data;
      localStorage.setItem("accessToken", newAccessToken);
      return true;
    } catch (error) {
      return false;
    }
  }
};
