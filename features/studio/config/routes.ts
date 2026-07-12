export const STUDIO_ROUTES = {
  login: "/studio/login",
  home: "/studio",
  orders: "/studio/orders",
  ordersNew: "/studio/orders/new",
  orderDetail: (id: string) => `/studio/orders/${id}` as const,
} as const;
