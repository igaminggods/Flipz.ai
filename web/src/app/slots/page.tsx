import Hero from "@/components/slots/HeroSlots";
import HowItWorks from "@/components/slots/HowItWorksSlots";
import ScanLock from "@/components/slots/ScanLockSlots";
import QuickGuide from "@/components/slots/QuickGuideSlots";
import FAQ from "@/components/slots/FAQSlots";
import SupportCTA from "@/components/SupportCTA";
import ScansSection from "@/components/slots/ScansSectionSlots";
import WinnersTicker from "@/components/slots/WinnersTickerSlots";
import Footer from "@/components/Footer";

export default function SlotsPage() {
  return (
    <div className="slots-page">
      <Hero />
      <section id="scan" className="container-max py-8 text-center">
        <ScanLock />
        <WinnersTicker className="mt-4" />
      </section>
      <HowItWorks />
      <ScansSection />
      <QuickGuide />
      <FAQ />
      <SupportCTA />
      <Footer />
    </div>
  );
}


