"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { QuantityStepper } from "@/components/QuantityStepper";
import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import { formatPrice, type Currency } from "@/lib/currency";

export type CartProductInput = {
  id: string;
  slug: string;
  name: string;
  imageUrl: string;
  priceRwf: number;
  unit: string;
  isSoldOut: boolean;
  variants: { id: string; name: string; priceRwf: number }[];
};

export function AddToCart({
  product,
  currency,
  layout = "detail",
}: {
  product: CartProductInput;
  currency: Currency;
  layout?: "card" | "detail";
}) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? null);
  const [justAdded, setJustAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const variant = product.variants.find((v) => v.id === variantId) ?? null;
  const unitPriceRwf = variant?.priceRwf ?? product.priceRwf;

  function handleAdd() {
    add({
      productId: product.id,
      variantId: variant?.id ?? null,
      slug: product.slug,
      name: product.name,
      variantName: variant?.name ?? null,
      unitPriceRwf,
      imageUrl: product.imageUrl,
      quantity,
    });
    setQuantity(1);
    setJustAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setJustAdded(false), 2200);
  }

  if (product.isSoldOut) {
    return (
      <Button variant="outline" disabled className={cn(layout === "card" && "w-full px-4 py-2.5 text-xs")}>
        Sold out today
      </Button>
    );
  }

  // A cake sold in three sizes can't be added from a card without a choice —
  // send the customer to the product page to pick one.
  if (layout === "card" && product.variants.length > 0) {
    return (
      <Link
        href={`/patisseries/${product.slug}`}
        className="inline-flex w-full items-center justify-center rounded-full bg-wine-800 px-4 py-2.5 text-xs font-semibold text-paper-50 transition-colors hover:bg-wine-700"
      >
        Choose a size
      </Link>
    );
  }

  if (layout === "card") {
    return (
      <div className="flex items-center gap-2">
        <QuantityStepper value={quantity} onChange={setQuantity} size="sm" />
        <Button
          onClick={handleAdd}
          className="flex-1 px-4 py-2.5 text-xs"
          aria-label={`Add ${product.name} to cart`}
        >
          {justAdded ? "Added ✓" : "Add"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {product.variants.length > 0 && (
        <fieldset>
          <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-700">Choose a size</legend>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <label
                key={v.id}
                className={cn(
                  "cursor-pointer rounded-xl border px-4 py-2.5 text-sm transition-colors",
                  v.id === variantId
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-ink-900/15 text-ink-700 hover:border-accent/40",
                )}
              >
                <input
                  type="radio"
                  name="variant"
                  value={v.id}
                  checked={v.id === variantId}
                  onChange={() => setVariantId(v.id)}
                  className="sr-only"
                />
                <span className="block font-medium">{v.name}</span>
                <span className="block text-xs opacity-80">{formatPrice(v.priceRwf, currency)}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <QuantityStepper value={quantity} onChange={setQuantity} />
        <Button onClick={handleAdd} className="flex-1 min-w-45">
          {justAdded ? "Added to cart ✓" : `Add to cart — ${formatPrice(unitPriceRwf * quantity, currency)}`}
        </Button>
      </div>

      {justAdded && (
        <p className="text-sm text-ink-700">
          <Link href="/cart" className="font-semibold text-accent underline underline-offset-4">
            Go to cart
          </Link>{" "}
          or keep browsing.
        </p>
      )}
    </div>
  );
}
