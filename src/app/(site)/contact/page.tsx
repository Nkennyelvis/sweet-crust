import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { Container, GoldRule, SectionHeading } from "@/components/ui";
import {
  BAKERY_INFO,
  DELIVERY_ZONES,
  FREE_DELIVERY_THRESHOLD_RWF,
  OPENING_HOURS,
  mapsEmbedUrl,
  whatsappLink,
} from "@/lib/bakery-info";
import { formatRwf } from "@/lib/currency";

export const metadata: Metadata = {
  title: "Contact & Visit",
  description:
    "Visit Sweet Crust in Kigali, or reach us by phone, WhatsApp or email. Opening hours, delivery zones and answers to the questions we get most.",
};

const FAQS = [
  {
    q: "Do you deliver?",
    a: `Yes, across Kigali. Fees run from ${formatRwf(2000)} in the city centre to ${formatRwf(4000)} for outer areas, and delivery is free on orders over ${formatRwf(FREE_DELIVERY_THRESHOLD_RWF)}. Pickup from the bakery is always free.`,
  },
  {
    q: "How do I pay?",
    a: "Place the order on the website and we will confirm it with you on WhatsApp, including payment by mobile money or cash on collection. We are working on paying directly through the site.",
  },
  {
    q: "How far ahead should I order?",
    a: "Breads and pastries are on the shelf daily — order the same morning. Cakes need one to two days, and wedding cakes at least two weeks.",
  },
  {
    q: "Can I order for an office or event?",
    a: "Very much so. Send the numbers and the time you need it on site and we will put a quote together. We have done 7am deliveries for 120 people and we would do it again.",
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="bg-wine-950 py-16 text-paper-50 sm:py-20">
        <Container className="text-center">
          <SectionHeading
            align="center"
            tone="dark"
            eyebrow="Come and see us"
            title="Contact & Visit"
            subtitle="The kettle is on from half past six. Call, message, or just walk in."
          />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="grid gap-14 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <h2 className="font-display text-3xl text-ink-900">Find the bakery</h2>
            <address className="mt-5 space-y-4 text-base not-italic text-ink-700">
              <p>{BAKERY_INFO.address}</p>
              <p>
                <a
                  href={`tel:${BAKERY_INFO.phoneDisplay.replace(/\s/g, "")}`}
                  className="font-medium text-accent hover:underline"
                >
                  {BAKERY_INFO.phoneDisplay}
                </a>
              </p>
              <p>
                <a href={`mailto:${BAKERY_INFO.email}`} className="font-medium text-accent hover:underline">
                  {BAKERY_INFO.email}
                </a>
              </p>
            </address>

            <a
              href={whatsappLink("Hello Sweet Crust! I have a question about an order.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-[#0a2e1f] transition-transform hover:scale-[1.02]"
            >
              <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden className="h-5 w-5">
                <path d="M16.02 3C9.4 3 4 8.4 4 15.02c0 2.34.65 4.53 1.78 6.4L4 29l7.76-1.73a12.9 12.9 0 0 0 4.26.73c6.62 0 12.02-5.4 12.02-12.02C28.04 8.4 22.64 3 16.02 3Zm0 21.8c-1.4 0-2.77-.31-4-.9l-.29-.15-4.6 1.02 1.05-4.48-.18-.3a9.7 9.7 0 0 1-1.5-5.17c0-5.4 4.4-9.8 9.8-9.8 5.4 0 9.8 4.4 9.8 9.8-.02 5.4-4.42 9.98-9.82 9.98Z" />
              </svg>
              Chat on WhatsApp
            </a>

            <GoldRule className="my-9" />

            <h2 className="font-display text-3xl text-ink-900">Opening hours</h2>
            <dl className="mt-5 space-y-2.5 text-base text-ink-700">
              {OPENING_HOURS.map((h) => (
                <div key={h.days} className="flex justify-between gap-6 border-b border-ink-900/10 pb-2.5">
                  <dt>{h.days}</dt>
                  <dd className="whitespace-nowrap font-medium text-ink-900">{h.hours}</dd>
                </div>
              ))}
            </dl>

            <GoldRule className="my-9" />

            <h2 className="font-display text-3xl text-ink-900">Delivery across Kigali</h2>
            <ul className="mt-5 space-y-3.5">
              {DELIVERY_ZONES.map((zone) => (
                <li key={zone.id} className="flex items-start justify-between gap-5 text-sm">
                  <div>
                    <p className="font-semibold text-ink-900">{zone.name}</p>
                    <p className="text-ink-700">{zone.areas}</p>
                  </div>
                  <span className="whitespace-nowrap font-semibold text-accent">{formatRwf(zone.feeRwf)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-xl bg-cream-100 px-5 py-3.5 text-sm text-ink-700">
              Free delivery on orders over{" "}
              <strong className="text-ink-900">{formatRwf(FREE_DELIVERY_THRESHOLD_RWF)}</strong>. Pickup is
              always free.
            </p>
          </div>

          <div>
            <div className="overflow-hidden rounded-3xl border border-ink-900/10">
              <iframe
                src={mapsEmbedUrl()}
                title={`Map showing ${BAKERY_INFO.name}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-72 w-full border-0"
              />
            </div>

            <div className="mt-8 rounded-3xl border border-ink-900/10 bg-surface p-7 shadow-sm sm:p-9">
              <h2 className="font-display text-3xl text-ink-900">Send us a message</h2>
              <p className="mt-2 text-sm text-ink-700">
                For anything that isn&apos;t urgent. If it is urgent, WhatsApp is faster.
              </p>
              <div className="mt-7">
                <ContactForm />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-cream-100 py-16">
        <Container>
          <SectionHeading align="center" eyebrow="Before you ask" title="Questions we get a lot" />
          <dl className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-2">
            {FAQS.map((f) => (
              <div key={f.q}>
                <dt className="font-display text-xl text-ink-900">{f.q}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-ink-700">{f.a}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>
    </>
  );
}
