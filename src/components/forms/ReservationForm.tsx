"use client";

import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { submitReservation } from "@/app/(site)/actions";
import { useFormFields } from "@/components/forms/useFormFields";
import { QuantityStepper } from "@/components/QuantityStepper";
import { Badge, Button, FieldError, Input, Label, Select, Textarea } from "@/components/ui";
import { TIME_WINDOWS, whatsappLink } from "@/lib/bakery-info";
import { cn } from "@/lib/cn";
import { formatPrice, type Currency } from "@/lib/currency";
import { EMPTY_STATE } from "@/lib/validation";

export type ReservableProduct = {
  id: string;
  slug: string;
  name: string;
  imageUrl: string;
  priceRwf: number;
  unit: string;
  isSoldOut: boolean;
  categoryName: string;
  variants: { id: string; name: string; priceRwf: number }[];
};

/** `YYYY-MM-DD`, `offsetDays` from today, in the visitor's own calendar. */
function dateInputValue(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function ReservationForm({
  products,
  currency,
}: {
  products: ReservableProduct[];
  currency: Currency;
}) {
  const params = useSearchParams();
  const [state, action, pending] = useActionState(submitReservation, EMPTY_STATE);

  // Read the product from the query string on the client. That works in the
  // static export too, where there is no request for the server to read.
  const preselected = params.get("product");
  const initialId =
    products.find((p) => p.slug === preselected)?.id ?? products[0]?.id ?? "";

  const { values, set, field } = useFormFields({
    productId: initialId,
    variantId: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    requestedDate: dateInputValue(1),
    timeWindow: TIME_WINDOWS[1] as string,
    notes: "",
  });
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === values.productId) ?? null;

  // Default to the first size whenever the chosen product has sizes.
  useEffect(() => {
    const first = product?.variants[0]?.id ?? "";
    set("variantId", first);
    // `set` is stable; product id is what actually drives this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.productId]);

  const variant = product?.variants.find((v) => v.id === values.variantId) ?? null;
  const unitPrice = variant?.priceRwf ?? product?.priceRwf ?? 0;

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-emerald-600/25 bg-emerald-500/10 p-8 text-center">
        <p className="font-display text-3xl text-ink-900">Reserved</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-700">{state.message}</p>
        <a
          href={whatsappLink(
            "Hello Sweet Crust! I just made a reservation through your website and wanted to confirm it.",
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-[#25D366] px-7 py-3.5 text-sm font-semibold text-[#0a2e1f]"
        >
          Confirm on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-6" noValidate>
      <input type="hidden" name="quantity" value={quantity} />
      {variant && <input type="hidden" name="variantId" value={variant.id} />}

      {state.message && (
        <p role="alert" className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-negative">
          {state.message}
        </p>
      )}

      <div>
        <Label htmlFor="productId">What would you like?</Label>
        <Select id="productId" required {...field("productId")}>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
              {p.isSoldOut ? " — sold out today" : ""}
            </option>
          ))}
        </Select>
        <FieldError>{state.errors?.productId}</FieldError>
      </div>

      {product && (
        <div className="flex items-center gap-4 rounded-2xl bg-cream-100 p-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
            <Image src={product.imageUrl} alt={product.name} fill sizes="80px" className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="font-display text-xl text-ink-900">{product.name}</p>
            <p className="mt-0.5 text-sm text-ink-700">
              {formatPrice(unitPrice, currency)} · {product.unit}
            </p>
            {product.isSoldOut && (
              <span className="mt-1.5 inline-block">
                <Badge tone="danger">Sold out today</Badge>
              </span>
            )}
          </div>
        </div>
      )}

      {product && product.variants.length > 0 && (
        <fieldset>
          <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-700">
            Which size?
          </legend>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                type="button"
                aria-pressed={v.id === values.variantId}
                onClick={() => set("variantId", v.id)}
                className={cn(
                  "rounded-xl border px-4 py-2.5 text-left text-sm transition-colors",
                  v.id === values.variantId
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-ink-900/15 text-ink-700 hover:border-accent/40",
                )}
              >
                <span className="block font-medium">{v.name}</span>
                <span className="block text-xs opacity-80">{formatPrice(v.priceRwf, currency)}</span>
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label>How many?</Label>
          <div className="mt-1">
            <QuantityStepper value={quantity} onChange={setQuantity} max={500} />
          </div>
          <FieldError>{state.errors?.quantity}</FieldError>
        </div>
        <div>
          <Label htmlFor="requestedDate">Which day do you need it?</Label>
          <Input
            id="requestedDate"
            type="date"
            required
            min={dateInputValue(1)}
            {...field("requestedDate")}
          />
          <p className="mt-1 text-xs text-ink-700">Tomorrow onwards — today is already baked.</p>
          <FieldError>{state.errors?.requestedDate}</FieldError>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="customerName">Your name</Label>
          <Input id="customerName" required autoComplete="name" {...field("customerName")} />
          <FieldError>{state.errors?.customerName}</FieldError>
        </div>
        <div>
          <Label htmlFor="customerPhone">Phone / WhatsApp</Label>
          <Input
            id="customerPhone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="0788 000 000"
            {...field("customerPhone")}
          />
          <FieldError>{state.errors?.customerPhone}</FieldError>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="customerEmail">Email (optional)</Label>
          <Input id="customerEmail" type="email" autoComplete="email" {...field("customerEmail")} />
          <FieldError>{state.errors?.customerEmail}</FieldError>
        </div>
        <div>
          <Label htmlFor="timeWindow">Roughly when? (optional)</Label>
          <Select id="timeWindow" {...field("timeWindow")}>
            {TIME_WINDOWS.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </Select>
          <FieldError>{state.errors?.timeWindow}</FieldError>
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Anything else? (optional)</Label>
        <Textarea
          id="notes"
          rows={3}
          placeholder="A flavour, a colour, a message to pipe on it, an allergy…"
          {...field("notes")}
        />
        <FieldError>{state.errors?.notes}</FieldError>
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Reserving…" : "Reserve it"}
      </Button>

      <p className="text-center text-xs leading-relaxed text-ink-700">
        Nothing is charged now. We confirm on WhatsApp that we can have it ready, and you pay on
        collection or delivery.
      </p>
    </form>
  );
}
