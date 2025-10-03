"use client";
import { useEffect, useRef, useState } from "react";
import CoinflipCards from "./CoinflipCards";
import CoinflipGame from "./CoinflipGame";

export default function ScansSection(){
  const [showScans, setShowScans] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [maxFlips, setMaxFlips] = useState<number | null>(null);
  const scansRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Restore state after refresh based on persisted keys
    try {
      const scanCompleted = typeof window !== 'undefined' ? localStorage.getItem('scan_completed') : null;
      if (scanCompleted === '1') {
        setShowScans(true);
      }
      const selected = typeof window !== 'undefined' ? localStorage.getItem('coinflip_selected') : null;
      const lockRaw = typeof window !== 'undefined' ? localStorage.getItem('coinflip_lock_until') : null;
      const lockUntil = lockRaw ? parseInt(lockRaw, 10) : null;
      const lockRemaining = lockUntil ? Math.max(0, lockUntil - Date.now()) : 0;
      if ((selected === 'instant' || selected === 'multiply') && lockRemaining > 0) {
        setMaxFlips(selected === 'multiply' ? 4 : 2);
        setShowGame(true);
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
    const onSelected = (e: Event) => {
      const custom = e as CustomEvent<{ mode?: "instant" | "multiply" } | undefined>;
      const mode = custom.detail?.mode;
      setMaxFlips(mode === 'multiply' ? 4 : 2);
      setShowGame(true);
      try {
        requestAnimationFrame(() => {
          scansRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      } catch {}
    };
    window.addEventListener("scan-completed", onScan);
    window.addEventListener("scan-selected", onSelected as EventListener);
    return () => {
      window.removeEventListener("scan-completed", onScan);
      window.removeEventListener("scan-selected", onSelected as EventListener);
    };
  }, []);

  return (
    <section id="scans" ref={scansRef} className="container-max py-8 text-center">
      {showScans && (
        <>
          <h2 className="display-title gradient-text mb-6">Active Scans Found</h2>
          <CoinflipCards />
        </>
      )}
      {showGame && (
        <div className="max-w-3xl mx-auto my-6 rounded-md border border-red-500/40 bg-red-500/10 text-red-300 p-3">
          Use the access gateway link to open the real Coinflip game, which syncs the casino game with Flipz.ai so we can predict the Coinflip outcome.
        </div>
      )}
      {showGame && <CoinflipGame className="reveal-in" maxFlips={maxFlips ?? undefined} />}
    </section>
  );
}


