"use client";
import { useEffect, useState } from "react";
import GlowCard from "@/components/GlowCard";

type Geo = { country?: string; countryCode?: string; city?: string };

export default function HowItWorks() {
  const [geo, setGeo] = useState<Geo>({});
  useEffect(() => {
    fetch("/api/geo")
      .then((r) => r.json())
      .then((d) => setGeo(d))
      .catch(() => {});
  }, []);

  const steps = [
    {
      title: "Geo Detection",
      desc:
        "We automatically detect your country and tailor scans to casinos legally available in your area, matching you with the most relevant Coin Flip opportunities.",
      icon: "/globe-color.svg",
      badgeClass: "badge-violet",
    },
    {
      title: "Deep Scan",
      desc:
        "Flipz AI runs nonstop analysis on Coin Flip mini-games, exposing hidden patterns, sudden payout spikes, and profit-driven anomalies.",
      icon: "/window-color.svg",
      badgeClass: "badge-cyan",
    },
    {
      title: "Results",
      desc:
        "You receive a curated report of up to 5 profitable Coin Flip patterns, localized to your region and matched with the exact conditions that triggered each anomaly.",
      icon: "/file-color.svg",
      badgeClass: "badge-green",
    },
    {
      title: "Play & Profit",
      desc:
        "Click, deposit and flip while the window of opportunity is still open.",
      icon: "/trophy.svg",
      badgeClass: "badge-gold tint-gold",
    },
  ];

  return (
    <section id="how-it-works" className="container-max py-16 text-center">
      <h2 className="display-title gradient-text mb-3">How Flipz AI Works </h2>
      <p className="lede max-w-4xl mx-auto mb-10">
      Flipz AI connects directly to live Coin Flip mini-games, scanning for profitable patterns and anomalies. 
      When a winning opportunity is detected, the system displays the correct flip outcome on our site. You then take this result into the real online casino game — turning the scan into profit.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((s) => (
          <GlowCard key={s.title} className="card p-6 text-center">
            <div className={`icon-badge ${s.badgeClass ?? ""} mx-auto mb-3`}>
              <img src={s.icon} alt="" width={28} height={28} />
            </div>
            <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
            <p className="subtle">{s.desc}</p>
          </GlowCard>
        ))}
      </div>

      <div className="legend mt-6">
        <span className="legend-item"><span className="legend-dot dot-green"></span>Real-time scanning</span>
        <span className="legend-item"><span className="legend-dot dot-violet"></span>AI-powered detection</span>
        <span className="legend-item"><span className="legend-dot dot-cyan"></span>Geo-optimized results</span>
      </div>
    </section>
  );
}


