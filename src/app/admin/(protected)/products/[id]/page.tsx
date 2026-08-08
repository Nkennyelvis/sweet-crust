import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { IS_DEMO } from "@/lib/demo";
import { prisma } from "@/lib/prisma";

// The demo bakes an editor page per seeded product so the walkthrough can open
// any of them. The live build resolves these on demand instead.
export async function generateStaticParams() {
  if (!IS_DEMO) return [];
  const products = await prisma.product.findMany({ select: { id: true } });
  return products.map((p) => ({ id: p.id }));
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { variants: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
  ]);

  if (!product) notFound();

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/admin/products" className="text-sm text-ink-700 hover:text-accent">
          ← Back to products
        </Link>
        <Link
          href={`/patisseries/${product.slug}`}
          target="_blank"
          className="text-sm font-semibold text-accent hover:underline"
        >
          View on the site ↗
        </Link>
      </div>

      <h1 className="mt-4 font-display text-4xl text-ink-900">{product.name}</h1>

      <div className="mt-8">
        <ProductForm
          categories={categories}
          initial={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            categoryId: product.categoryId,
            description: product.description,
            longDescription: product.longDescription,
            priceRwf: String(product.priceRwf),
            imageUrls: product.imageUrls,
            allergens: product.allergens,
            unit: product.unit,
            leadTimeHours: String(product.leadTimeHours),
            sortOrder: String(product.sortOrder),
            isFeatured: product.isFeatured,
            isSoldOut: product.isSoldOut,
            isActive: product.isActive,
            variants: product.variants.map((v) => ({ name: v.name, priceRwf: String(v.priceRwf) })),
          }}
        />
      </div>
    </>
  );
}
