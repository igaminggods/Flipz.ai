"use client";
import { useEffect, useRef, useState } from "react";
import CoinflipCards from "./CoinflipCards";
import CoinflipGame from "./CoinflipGame";

export default function ScansSection(){
  const [showScans, setShowScans] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [maxFlips, setMaxFlips] = useState<number | null>(null);
  const scansRef = useRef<HTMLDivElement | null>(null);
  const gameAnchorRef = useRef<HTMLDivElement | null>(null);
  const gameContainerRef = useRef<HTMLDivElement | null>(null);

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
          // Let DOM update first
          setTimeout(() => {
            const linkEl = document.querySelector('.scan-card .btn-primary[href*="padrinopartners"]') as HTMLElement | null;
            const gameEl = gameContainerRef.current;
            if (!linkEl || !gameEl) {
              const fallback = gameAnchorRef.current ?? scansRef.current;
              if (fallback) {
                const r = fallback.getBoundingClientRect();
                const top = Math.max(0, r.top + window.scrollY - Math.floor(window.innerHeight * 0.35));
                window.scrollTo({ top, behavior: 'smooth' });
              }
              return;
            }
            const linkRect = linkEl.getBoundingClientRect();
            const gameRect = gameEl.getBoundingClientRect();
            const pageLinkTop = linkRect.top + window.scrollY;
            const pageGameBottom = gameRect.bottom + window.scrollY;
            // Aim to have link near top, but ensure game bottom fits in viewport
            const paddingTop = Math.floor(window.innerHeight * 0.08);
            let targetTop = Math.max(0, pageLinkTop - paddingTop);
            const maxTopForGame = Math.max(0, pageGameBottom - window.innerHeight + 8);
            targetTop = Math.min(targetTop, maxTopForGame);
            window.scrollTo({ top: targetTop, behavior: 'smooth' });
          }, 0);
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
      {/* Anchor above game to position viewport so that access links + game fit on screen */}
      <div ref={gameAnchorRef} aria-hidden="true" style={{ height: 0 }} />
      {showGame && (
        <div className="max-w-3xl mx-auto my-6 rounded-md border border-red-500/40 bg-red-500/10 text-red-300 p-3">
          Use the access gateway link to open the real Coinflip game, which syncs the casino game with Flipz.ai so we can predict the Coinflip outcome.
        </div>
      )}
      {showGame && (
        <div ref={gameContainerRef}>
          <CoinflipGame className="reveal-in" maxFlips={maxFlips ?? undefined} />
        </div>
      )}
    </section>
  );
}


