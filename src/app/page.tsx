import { AboutDecantsSection } from "@/components/home/about-decants-section";
import { BenefitsSection } from "@/components/home/benefits-section";
import { FeaturedProductsSection } from "@/components/home/featured-products-section";
import { FullBottleCtaSection } from "@/components/home/full-bottle-cta-section";
import { HeroSection } from "@/components/home/hero-section";
import { ImportantInfoSection } from "@/components/home/important-info-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />

        <FeaturedProductsSection
          title="Mais Vendidos"
          viewAllHref="/mais-vendidos"
          filterColumn="is_bestseller"
        />

        <BenefitsSection />

        <AboutDecantsSection />

        <FullBottleCtaSection />

        <ImportantInfoSection />

        <FeaturedProductsSection
          title="Exclusivos"
          viewAllHref="/exclusivos"
          filterColumn="is_exclusive"
          background="primary"
        />
      </main>
      <SiteFooter />
    </>
  );
}
