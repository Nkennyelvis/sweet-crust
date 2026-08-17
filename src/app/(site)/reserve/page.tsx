import type { Metadata } from "next";
import { Suspense } from "react";
import { ReservationForm } from "@/components/forms/ReservationForm";
import { Container, GoldRule, SectionHeading } from "@/components/ui";
import { getCurrency } from "@/lib/currency-server";
import { primaryImage } from "@/lib/products";
import { getReservableProducts } from "@/lib/reservations";

export const metadata: Metadata = {
  title: "Reserve an Item",
  description:
    "Sold out, or need something on a particular day? Reserve it with Sweet Crust and we will have it ready for you in Kigali.",
};

const STEPS = [
  {
    title: "Tell us what and when",
    body: "Pick the item, the size, how many and the day you need it. Tomorrow onwards — today is already baked.",
  },
  {
    title: "We confirm",
    body: "We check the kitchen diary and confirm on WhatsApp, usually within the hour, that it will be ready.",
  },
  {
    title: "It is waiting for you",
    body: "Collect it on the day, or ask us to deliver. You pay then — nothing is charged to reserve.",
  },
];

export default async function ReservePage() {
  const [currency, products] = await Promise.all([getCurrency(), getReservableProducts()]);

  return (
    <>
      <section className="bg-wine-950 py-16 text-paper-50 sm:py-20">
        <Container className="text-center">
          <SectionHeading
            align="center"
            tone="dark"
            eyebrow="Sold out? Reserve it"
            title="Reserve an item"
            subtitle="If what you came for has gone, or you need it on a particular day, reserve it and we will make sure it is there."
          />
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container className="grid gap-14 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <SectionHeading eyebrow="How it works" title="Three steps" />
            <ol className="mt-8 space-y-7">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-wine-800 font-display text-base font-semibold text-paper-50">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-xl text-ink-900">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-700">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <GoldRule className="my-9" />

            <p className="text-sm leading-relaxed text-ink-700">
              Reserving is not the same as ordering. If the item is on the shelf today and you want it
              today, just add it to your cart instead — it is quicker.
            </p>
          </div>

          <div className="rounded-3xl border border-ink-900/10 bg-surface p-7 shadow-sm sm:p-9">
            {/* useSearchParams needs a Suspense boundary during prerender. */}
            <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-cream-100" />}>
              <ReservationForm
                currency={currency}
                products={products.map((p) => ({
                  id: p.id,
                  slug: p.slug,
                  name: p.name,
                  imageUrl: primaryImage(p.imageUrls),
                  priceRwf: p.priceRwf,
                  unit: p.unit,
                  isSoldOut: p.isSoldOut,
                  categoryName: p.category.name,
                  variants: p.variants.map((v) => ({ id: v.id, name: v.name, priceRwf: v.priceRwf })),
                }))}
              />
            </Suspense>
          </div>
        </Container>
      </section>
    </>
  );
}
