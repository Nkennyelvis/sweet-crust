import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";
import { Container, SectionHeading } from "@/components/ui";
import { getCurrency } from "@/lib/currency-server";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review your Sweet Crust order and choose pickup or delivery anywhere in Kigali.",
  robots: { index: false },
};

export default async function CartPage() {
  const currency = await getCurrency();

  return (
    <>
      <section className="bg-wine-950 py-14 text-paper-50">
        <Container className="text-center">
          <SectionHeading
            align="center"
            tone="dark"
            eyebrow="Almost there"
            title="Your Cart"
            subtitle="Check the basket, tell us when you want it, and we will confirm on WhatsApp."
          />
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <CartView currency={currency} />
        </Container>
      </section>
    </>
  );
}
