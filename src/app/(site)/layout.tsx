import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { BakeryStructuredData } from "@/components/StructuredData";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CartProvider } from "@/components/cart/CartProvider";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <BakeryStructuredData />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </CartProvider>
  );
}
