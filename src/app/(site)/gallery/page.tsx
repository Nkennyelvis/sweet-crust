import type { Metadata } from "next";
import { GalleryGrid } from "@/components/GalleryGrid";
import { Container, LinkButton, SectionHeading } from "@/components/ui";
import { getGalleryImages } from "@/lib/products";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Inside the Sweet Crust bakery in Kigali — the counter at opening, celebration cakes finished by hand, and bread straight off the deck oven.",
};

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <>
      <section className="bg-wine-950 py-16 text-paper-50 sm:py-20">
        <Container className="text-center">
          <SectionHeading
            align="center"
            tone="dark"
            eyebrow="A look inside"
            title="Gallery"
            subtitle="Mornings at the bench, cakes we were proud of, and the counter before Kigali gets to it."
          />
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <GalleryGrid
            images={images.map((i) => ({
              id: i.id,
              imageUrl: i.imageUrl,
              caption: i.caption,
              tag: i.tag,
            }))}
          />
        </Container>
      </section>

      <section className="bg-cream-100 py-16">
        <Container className="flex flex-col items-center gap-6 text-center">
          <SectionHeading
            align="center"
            eyebrow="Seen something you like?"
            title="Most of it is on the menu"
            subtitle="And if it isn't, we will happily make it for you."
          />
          <div className="flex flex-wrap justify-center gap-4">
            <LinkButton href="/patisseries">Patisserie Menu</LinkButton>
            <LinkButton href="/custom-cakes" variant="outline">
              Custom orders
            </LinkButton>
          </div>
        </Container>
      </section>
    </>
  );
}
