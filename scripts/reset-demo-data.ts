/**
 * Clears everything a customer creates — orders, custom cake requests and
 * contact messages — leaving the catalogue, gallery and staff accounts alone.
 *
 *   npx tsx scripts/reset-demo-data.ts
 *
 * Use it after demoing the site to hand over a clean database.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const [items, orders, reservations, requests, messages] = await prisma.$transaction([
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
    prisma.reservation.deleteMany(),
    prisma.customCakeRequest.deleteMany(),
    prisma.contactMessage.deleteMany(),
  ]);

  console.log(
    `Cleared ${orders.count} orders (${items.count} line items), ` +
      `${reservations.count} reservations, ` +
      `${requests.count} custom cake requests, ${messages.count} messages.`,
  );
  console.log("Catalogue, gallery and staff accounts were left untouched.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
