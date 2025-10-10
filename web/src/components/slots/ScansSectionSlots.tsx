"use client";
import { useEffect, useRef, useState } from "react";
import SlotsCards from "@/components/slots/SlotsCards";

export default function ScansSectionSlots(){
  const [showScans, setShowScans] = useState(false);
  const scansRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const scanCompleted = typeof window !== 'undefined' ? localStorage.getItem('scan_completed') : null;
      if (scanCompleted === '1') {
        setShowScans(true);
      }
    } catch {}

    const onScan = () => {
      setShowScans(true);
      try {
        requestAnimationFrame(() => {
          scansRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      } catch {}
    };
    window.addEventListener("scan-completed", onScan);
    return () => {
      window.removeEventListener("scan-completed", onScan);
    };
  }, []);

  return (
    <section id="scans" ref={scansRef} className="container-max py-8 text-center">
      {showScans && (
        <>
          <h2 className="display-title gradient-text mb-6">Active Scans Found</h2>
          <SlotsCards />
        </>
      )}
    </section>
  );
}



