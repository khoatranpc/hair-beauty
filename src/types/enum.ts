export enum LocalStorage {
  access_token = "access_token",
  checkout_products = "checkout_products",
}
export enum UserRole {
  ADMIN = "admin",
  STAFF = "staff",
  CUSTOMER = "customer",
}
export enum CartActionType {
  ADD = "add",
  UPDATE = "update",
  REMOVE = "remove",
  CLEAR = "clear",
}

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  SHIPPING = "shipping",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export enum PaymentMethod {
  COD = "cod",
  BANKING = "banking",
  SHIP = "ship",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
}
