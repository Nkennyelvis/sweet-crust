import { prisma } from "@/lib/prisma";
import { BAKERY_INFO } from "@/lib/bakery-info";
import { OPEN_RESERVATION_STATUSES, type ReservationStatus } from "@/lib/enums";
import { formatDate } from "@/lib/format";

// Same unambiguous alphabet as order numbers — no O/0/I/1, so a reference read
// out over the phone survives.
const CODE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

function randomCode(length = 6) {
  let out = "";
  for (let i = 0; i < length; i++) out += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  return out;
}

export async function generateReservationReference() {
  for (let attempt = 0; attempt < 10; attempt++) {
    const candidate = `RS-${randomCode()}`;
    if (!(await prisma.reservation.findUnique({ where: { reference: candidate } }))) return candidate;
  }
  return `RS-${Date.now().toString(36).toUpperCase()}`;
}

/** Products a customer can reserve — everything on the menu, sold out or not. */
export function getReservableProducts() {
  return prisma.product.findMany({
    where: { isActive: true },
    orderBy: [{ isSoldOut: "desc" }, { sortOrder: "asc" }],
    include: { category: true, variants: { orderBy: { sortOrder: "asc" } } },
  });
}

/**
 * Reservations in the order staff actually work them: still-open ones first,
 * soonest date at the top, then the finished ones newest-first.
 *
 * Sorted in JS rather than SQL because `status` is a plain String column (no
 * enum in SQLite), so ordering by it is alphabetical — which put COLLECTED
 * above NEW and buried the ones that still need doing.
 */
export async function getReservations() {
  const all = await prisma.reservation.findMany();
  const rank = (status: string) =>
    OPEN_RESERVATION_STATUSES.includes(status as ReservationStatus) ? 0 : 1;

  return all.sort((a, b) => {
    const byOpen = rank(a.status) - rank(b.status);
    if (byOpen !== 0) return byOpen;
    if (rank(a.status) === 0) return a.requestedDate.getTime() - b.requestedDate.getTime();
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}

/**
 * The message the customer sends to confirm a reservation. Nothing is paid at
 * this point, so this handoff is what actually gets the bakery to commit.
 */
export function reservationWhatsAppMessage(r: {
  reference: string;
  customerName: string;
  productNameSnapshot: string;
  variantName: string | null;
  quantity: number;
  requestedDate: Date;
  timeWindow: string | null;
}) {
  return [
    `Hello ${BAKERY_INFO.name}! I'd like to reserve ${r.reference}.`,
    "",
    `• ${r.quantity} × ${r.productNameSnapshot}${r.variantName ? ` (${r.variantName})` : ""}`,
    `For: ${formatDate(r.requestedDate)}${r.timeWindow ? `, ${r.timeWindow}` : ""}`,
    "",
    `Name: ${r.customerName}`,
    "Can you confirm you'll have it ready? Thank you!",
  ].join("\n");
}
