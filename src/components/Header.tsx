import Link from "next/link";
import { BrandLockup } from "@/components/BrandLogo";
import { CartButton } from "@/components/CartButton";
import { CurrencyToggle } from "@/components/CurrencyToggle";
import { MobileMenu } from "@/components/MobileMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Container } from "@/components/ui";
import { getCurrency } from "@/lib/currency-server";
import { getTheme } from "@/lib/theme";

const NAV_ITEMS = [
  { href: "/patisseries", label: "Patisseries" },
  { href: "/custom-cakes", label: "Custom Cakes" },
  { href: "/reserve", label: "Reserve" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export async function Header() {
  const [theme, currency] = await Promise.all([getTheme(), getCurrency()]);

  // The bar uses `cream-50` (which flips with the page), NOT `paper-50`
  // (pinned light) — pinning it left a near-white bar carrying dark-mode
  // light text, which made the nav effectively invisible.
  return (
    <header className="sticky top-0 z-40 border-b border-ink-900/10 bg-cream-50/85 backdrop-blur-md">
      <Container className="flex h-[72px] items-center justify-between gap-4">
        <Link href="/" aria-label="Sweet Crust — home">
          <BrandLockup />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink-700 transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5 text-ink-900">
          <div className="hidden items-center gap-2.5 lg:flex">
            <ThemeToggle theme={theme} />
            <CurrencyToggle currency={currency} />
          </div>
          <CartButton />
          <Link
            href="/patisseries"
            className="hidden rounded-full bg-wine-800 px-5 py-2.5 text-sm font-semibold text-paper-50 transition-colors hover:bg-wine-700 sm:inline-flex"
          >
            Order Now
          </Link>
          <MobileMenu currency={currency} theme={theme} navItems={NAV_ITEMS} />
        </div>
      </Container>
    </header>
  );
}
