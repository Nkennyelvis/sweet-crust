import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { CATALOG, GALLERY_EXTRAS } from "./catalog";

const prisma = new PrismaClient();

// Dev credentials only. The real bakery's owner account must be created with a
// proper password before launch — see the README checklist.
const OWNER_EMAIL = process.env.SEED_OWNER_EMAIL ?? "owner@sweetcrust.rw";
const OWNER_PASSWORD = process.env.SEED_OWNER_PASSWORD ?? "sweetcrust123";

/** Product photos worth showing in the gallery alongside the atmosphere shots. */
const GALLERY_FROM_PRODUCTS: { slug: string; caption: string; tag: string }[] = [
  { slug: "sourdough-boule", caption: "Sourdough, thirty-six hours in the making", tag: "breads" },
  { slug: "french-baguette", caption: "Baguettes, baked three times a day", tag: "breads" },
  { slug: "dark-rye-loaf", caption: "Dark rye, malted and molassed", tag: "breads" },
  { slug: "wedding-cake", caption: "A wedding cake we were trusted with", tag: "cakes" },
  { slug: "red-velvet-cake", caption: "Red velvet, cut to order", tag: "cakes" },
  { slug: "chocolate-mousse-cake", caption: "Mirror-glazed chocolate mousse", tag: "cakes" },
  { slug: "tropical-fruit-cake", caption: "Whatever the market gave us this morning", tag: "cakes" },
  { slug: "butter-croissant", caption: "Twenty-seven layers of butter", tag: "pastries" },
  { slug: "custard-tart", caption: "Blistered custard tarts, eaten warm", tag: "pastries" },
  { slug: "mille-feuille", caption: "Mille-feuille, feathered by hand", tag: "pastries" },
];

async function main() {
  console.log("Seeding Sweet Crust…");

  // Staff ------------------------------------------------------------------
  await prisma.staffUser.upsert({
    where: { email: OWNER_EMAIL },
    update: {},
    create: {
      name: "Sweet Crust Owner",
      email: OWNER_EMAIL,
      passwordHash: await bcrypt.hash(OWNER_PASSWORD, 10),
      role: "OWNER",
    },
  });
  console.log(`  staff: ${OWNER_EMAIL}`);

  // Categories and products ------------------------------------------------
  let productCount = 0;

  for (const [categoryIndex, seedCategory] of CATALOG.entries()) {
    const category = await prisma.category.upsert({
      where: { slug: seedCategory.slug },
      update: {
        name: seedCategory.name,
        description: seedCategory.description,
        imageUrl: `/images/categories/${seedCategory.slug}.jpg`,
        sortOrder: categoryIndex,
      },
      create: {
        slug: seedCategory.slug,
        name: seedCategory.name,
        description: seedCategory.description,
        imageUrl: `/images/categories/${seedCategory.slug}.jpg`,
        sortOrder: categoryIndex,
      },
    });

    for (const [productIndex, p] of seedCategory.products.entries()) {
      const data = {
        name: p.name,
        description: p.description,
        longDescription: p.longDescription,
        priceRwf: p.priceRwf,
        imageUrls: `/images/products/${p.slug}.jpg`,
        allergens: p.allergens,
        unit: p.unit,
        leadTimeHours: p.leadTimeHours ?? 0,
        isFeatured: p.isFeatured ?? false,
        isSoldOut: p.isSoldOut ?? false,
        isActive: true,
        sortOrder: productIndex,
        categoryId: category.id,
      };

      const product = await prisma.product.upsert({
        where: { slug: p.slug },
        update: data,
        create: { slug: p.slug, ...data },
      });

      // Replace variants wholesale — simpler and safer than diffing, and the
      // seed is the source of truth for them.
      await prisma.productVariant.deleteMany({ where: { productId: product.id } });
      if (p.variants?.length) {
        await prisma.productVariant.createMany({
          data: p.variants.map((v, i) => ({
            productId: product.id,
            name: v.name,
            priceRwf: v.priceRwf,
            sortOrder: i,
          })),
        });
      }

      productCount++;
    }
  }
  console.log(`  categories: ${CATALOG.length}, products: ${productCount}`);

  // Gallery ----------------------------------------------------------------
  const galleryRows = [
    ...GALLERY_EXTRAS.map((g, i) => ({
      imageUrl: `/images/gallery/${g.slug}.jpg`,
      caption: g.caption,
      tag: g.tag,
      sortOrder: i,
    })),
    ...GALLERY_FROM_PRODUCTS.map((g, i) => ({
      imageUrl: `/images/products/${g.slug}.jpg`,
      caption: g.caption,
      tag: g.tag,
      sortOrder: GALLERY_EXTRAS.length + i,
    })),
  ];

  await prisma.galleryImage.deleteMany();
  await prisma.galleryImage.createMany({ data: galleryRows });
  console.log(`  gallery images: ${galleryRows.length}`);

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
