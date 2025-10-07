import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import ScanLock from "@/components/ScanLock";
import QuickGuide from "@/components/QuickGuide";
import FAQ from "@/components/FAQ";
import SupportCTA from "@/components/SupportCTA";
import Footer from "@/components/Footer";
import ScansSection from "@/components/ScansSection";
import WinnersTicker from "@/components/WinnersTicker";

export default function Home() {
  return (
    <div>
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
