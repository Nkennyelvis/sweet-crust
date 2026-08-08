import Image from "next/image";
import Link from "next/link";
import { AddToCart } from "@/components/AddToCart";
import { Badge } from "@/components/ui";
import { formatPrice, type Currency } from "@/lib/currency";
import { primaryImage, startingPriceRwf, type ProductWithRelations } from "@/lib/products";

export function ProductCard({
  product,
  currency,
}: {
  product: ProductWithRelations;
  currency: Currency;
}) {
  const image = primaryImage(product.imageUrls);
  const fromPrice = startingPriceRwf(product);
  const hasRange = product.variants.length > 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-ink-900/10 bg-surface shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/patisseries/${product.slug}`} className="relative block aspect-4/3 overflow-hidden">
        <Image
          src={image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.isSoldOut && (
          <span className="absolute inset-0 flex items-center justify-center bg-wine-950/60 text-sm font-semibold uppercase tracking-widest text-paper-50">
            Sold out
          </span>
        )}
        {!product.isSoldOut && product.isFeatured && (
          <span className="absolute left-3 top-3">
            <Badge tone="gold">Bestseller</Badge>
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl leading-snug text-ink-900">
          <Link href={`/patisseries/${product.slug}`} className="hover:text-accent">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-700">{product.description}</p>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-display text-lg font-semibold text-accent">
            {hasRange && <span className="text-xs font-normal text-ink-700">from </span>}
            {formatPrice(fromPrice, currency)}
          </span>
          <span className="text-xs text-ink-700">{product.unit}</span>
        </div>

        {product.leadTimeHours > 0 && (
          <p className="mt-1.5 text-xs text-ink-700">
            {product.leadTimeHours >= 24
              ? `${Math.round(product.leadTimeHours / 24)} day${product.leadTimeHours >= 48 ? "s" : ""} notice`
              : `${product.leadTimeHours} hours notice`}
          </p>
        )}

        <div className="mt-5 pt-1">
          <AddToCart
            layout="card"
            currency={currency}
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              imageUrl: image,
              priceRwf: product.priceRwf,
              unit: product.unit,
              isSoldOut: product.isSoldOut,
              variants: product.variants.map((v) => ({ id: v.id, name: v.name, priceRwf: v.priceRwf })),
            }}
          />
        </div>
      </div>
    </article>
  );
}
