// SQLite has no native enum type in Prisma, so the matching schema columns are
// plain Strings validated against the unions below.

export const STAFF_ROLES = ["OWNER", "MANAGER", "BAKER"] as const;
export type StaffRole = (typeof STAFF_ROLES)[number];

export const FULFILLMENT_METHODS = ["PICKUP", "DELIVERY"] as const;
export type FulfillmentMethod = (typeof FULFILLMENT_METHODS)[number];

export const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "BAKING",
  "READY",
  "OUT_FOR_DELIVERY",
  "COMPLETED",
  "CANCELLED",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** Orders still needing kitchen or counter attention. */
export const OPEN_ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "BAKING",
  "READY",
  "OUT_FOR_DELIVERY",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  BAKING: "In the oven",
  READY: "Ready",
  OUT_FOR_DELIVERY: "Out for delivery",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const RESERVATION_STATUSES = [
  "NEW",
  "CONFIRMED",
  "READY",
  "COLLECTED",
  "CANCELLED",
] as const;
export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];

export const RESERVATION_STATUS_LABELS: Record<ReservationStatus, string> = {
  NEW: "New",
  CONFIRMED: "Confirmed",
  READY: "Ready to collect",
  COLLECTED: "Collected",
  CANCELLED: "Cancelled",
};

/** Reservations the kitchen still owes the customer something for. */
export const OPEN_RESERVATION_STATUSES: ReservationStatus[] = ["NEW", "CONFIRMED", "READY"];

export const REQUEST_STATUSES = ["NEW", "CONTACTED", "QUOTED", "CLOSED"] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUOTED: "Quoted",
  CLOSED: "Closed",
};
