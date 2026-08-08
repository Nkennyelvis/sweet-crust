import type { Metadata } from "next";
import Image from "next/image";
import { CustomCakeForm } from "@/components/forms/CustomCakeForm";
import { Container, GoldRule, SectionHeading } from "@/components/ui";
import { formatRwf } from "@/lib/currency";

export const metadata: Metadata = {
  title: "Custom Cakes",
  description:
    "Custom cakes in Kigali for birthdays, graduations, weddings, dowries and office celebrations — decorated by hand. Send your idea and Sweet Crust will quote it and build it.",
};

const STEPS = [
  {
    title: "Tell us the idea",
    body: "Fill in the form below with the occasion, the date, roughly how many people, and anything you already picture. A napkin sketch is plenty.",
  },
  {
    title: "We quote it",
    body: "We call or WhatsApp you within one working day with a design, a price and an honest word on what is and isn't possible in the time you have.",
  },
  {
    title: "Tasting and deposit",
    body: "For weddings and other large orders we bake you a tasting before anything is agreed. A 50% deposit books the date in the kitchen diary.",
  },
  {
    title: "We bake and deliver",
    body: "Collected from the bakery or delivered anywhere in Kigali, set up and photographed before we leave.",
  },
];

const FAQS = [
  {
    q: "How much notice do you need?",
    a: "Two days for a decorated celebration cake, and at least two weeks for a tiered wedding cake. If your date is sooner than that, ask anyway — sometimes we can move things around.",
  },
  {
    q: "What does a custom cake cost?",
    a: `Decorated celebration cakes start around ${formatRwf(24000)} for a 6 inch. Tiered wedding cakes start around ${formatRwf(130000)} for two tiers. The final price depends on size, decoration and how much handwork the design needs.`,
  },
  {
    q: "Can you copy a cake I saw online?",
    a: "We can work from a reference, and we will tell you plainly if something in the photo isn't achievable — or isn't edible. What we will not do is pretend a fondant sculpture is a two-day job when it is a five-day one.",
  },
  {
    q: "Do you cater for allergies?",
    a: "We can adapt many recipes, but everything is baked in one kitchen handling gluten, dairy, eggs, nuts and sesame, so we cannot promise a trace-free cake. Tell us about the allergy and we will be honest about the risk.",
  },
];

export default function CustomCakesPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden py-24 sm:py-32">
        <Image
          src="/images/feature/custom-cake-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-wine-950/85" />
        <Container className="text-center">
          <SectionHeading
            align="center"
            tone="dark"
            eyebrow="Made only for you"
            title="Custom Cakes"
            subtitle="Birthdays, graduations, baby showers, dowries, office launches — and weddings too. Bring us a photo, a colour, a theme or a sketch on the back of a receipt."
          />
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading align="center" eyebrow="How it works" title="Four steps, no surprises" />
          <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <li key={step.title}>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-wine-800 font-display text-lg font-semibold text-paper-50">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-display text-2xl text-ink-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-cream-100 py-20">
        <Container className="grid gap-14 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <SectionHeading eyebrow="Your request" title="Tell us about your cake" />
            <p className="mt-4 text-base leading-relaxed text-ink-700">
              The more you tell us here, the better the first quote will be. Nothing is binding — this just
              starts the conversation.
            </p>
            <GoldRule className="my-8" />
            <dl className="space-y-6">
              {FAQS.map((f) => (
                <div key={f.q}>
                  <dt className="font-display text-xl text-ink-900">{f.q}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-ink-700">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-3xl border border-ink-900/10 bg-surface p-7 shadow-sm sm:p-9">
            <CustomCakeForm />
          </div>
        </Container>
      </section>
    </>
  );
}
